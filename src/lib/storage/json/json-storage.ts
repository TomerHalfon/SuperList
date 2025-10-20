import { promises as fs } from 'fs';
import { join } from 'path';
import { StorageError } from '../interfaces';

/**
 * Core JSON file storage utilities with atomic operations and file locking
 */
export class JsonStorage {
  private readonly dataDir: string;
  private readonly lockFiles = new Map<string, Promise<void>>();

  constructor(dataDir: string = 'data') {
    this.dataDir = dataDir;
  }

  /**
   * Ensure the data directory exists
   */
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      throw new StorageError(
        `Failed to create data directory: ${error}`,
        'DIRECTORY_CREATION_FAILED'
      );
    }
  }

  /**
   * Get the full path for a data file
   */
  private getFilePath(filename: string): string {
    return join(this.dataDir, filename);
  }

  /**
   * Get the lock file path for a data file
   */
  private getLockFilePath(filename: string): string {
    return join(this.dataDir, `.${filename}.lock`);
  }

  /**
   * Acquire a file lock to prevent concurrent access
   */
  private async acquireLock(filename: string): Promise<void> {
    const lockFile = this.getLockFilePath(filename);
    
    // If there's already a lock for this file, wait for it
    if (this.lockFiles.has(filename)) {
      await this.lockFiles.get(filename);
    }

    // Create a new lock promise
    const lockPromise = this.createLock(lockFile);
    this.lockFiles.set(filename, lockPromise);
    
    try {
      await lockPromise;
    } catch (error) {
      this.lockFiles.delete(filename);
      throw error;
    }
  }

  /**
   * Create a lock file
   */
  private async createLock(lockFile: string): Promise<void> {
    const maxRetries = 10;
    const retryDelay = 100; // ms

    for (let i = 0; i < maxRetries; i++) {
      try {
        // Try to create the lock file exclusively
        const fd = await fs.open(lockFile, 'wx');
        await fd.close();
        return;
      } catch (error: any) {
        if (error.code === 'EEXIST') {
          // Lock file exists, wait and retry
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        throw new StorageError(
          `Failed to acquire lock: ${error.message}`,
          'LOCK_ACQUISITION_FAILED'
        );
      }
    }

    throw new StorageError(
      'Failed to acquire lock after maximum retries',
      'LOCK_TIMEOUT'
    );
  }

  /**
   * Release a file lock
   */
  private async releaseLock(filename: string): Promise<void> {
    const lockFile = this.getLockFilePath(filename);
    
    try {
      await fs.unlink(lockFile);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.warn(`Failed to release lock file ${lockFile}:`, error.message);
      }
    } finally {
      this.lockFiles.delete(filename);
    }
  }

  /**
   * Read JSON data from a file with atomic operation
   */
  async readJson<T>(filename: string, defaultValue: T): Promise<T> {
    await this.ensureDataDir();
    await this.acquireLock(filename);

    try {
      const filePath = this.getFilePath(filename);
      
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          // File doesn't exist, return default value
          return defaultValue;
        }
        
        if (error instanceof SyntaxError) {
          throw new StorageError(
            `Invalid JSON in file ${filename}: ${error.message}`,
            'INVALID_JSON'
          );
        }
        
        throw new StorageError(
          `Failed to read file ${filename}: ${error.message}`,
          'READ_FAILED'
        );
      }
    } finally {
      await this.releaseLock(filename);
    }
  }

  /**
   * Write JSON data to a file with atomic operation
   */
  async writeJson<T>(filename: string, data: T): Promise<void> {
    await this.ensureDataDir();
    await this.acquireLock(filename);

    try {
      const filePath = this.getFilePath(filename);
      const tempFilePath = `${filePath}.tmp`;
      
      try {
        // Write to temporary file first
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(tempFilePath, jsonData, 'utf-8');
        
        // Atomically move temp file to final location
        await fs.rename(tempFilePath, filePath);
      } catch (error: any) {
        // Clean up temp file if it exists
        try {
          await fs.unlink(tempFilePath);
        } catch {
          // Ignore cleanup errors
        }
        
        throw new StorageError(
          `Failed to write file ${filename}: ${error.message}`,
          'WRITE_FAILED'
        );
      }
    } finally {
      await this.releaseLock(filename);
    }
  }

  /**
   * Check if a file exists
   */
  async fileExists(filename: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(filename: string): Promise<void> {
    await this.acquireLock(filename);

    try {
      const filePath = this.getFilePath(filename);
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw new StorageError(
          `Failed to delete file ${filename}: ${error.message}`,
          'DELETE_FAILED'
        );
      }
    } finally {
      await this.releaseLock(filename);
    }
  }

  /**
   * Get file stats
   */
  async getFileStats(filename: string) {
    try {
      const filePath = this.getFilePath(filename);
      return await fs.stat(filePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw new StorageError(
        `Failed to get file stats for ${filename}: ${error.message}`,
        'STAT_FAILED'
      );
    }
  }
}
