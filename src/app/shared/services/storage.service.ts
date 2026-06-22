import { Injectable } from '@angular/core';
import { EncryptStorage } from 'encrypt-storage';
import { environment } from 'src/environments/environment';

export const encryptStorage = new EncryptStorage(environment.secretKey);

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    saveLocalStorage(key: string, value: string) {
        const hash = encryptStorage.hash(key);
        encryptStorage.setItem(hash, value);
    }

    getLocalStorage<T = string>(key: string): T | undefined {
        const hash = encryptStorage.hash(key);
        return encryptStorage.getItem<T>(hash);
    }

    deleteKeyStorage(key: string) {
        const hash = encryptStorage.hash(key);
        return encryptStorage.removeItem(hash);
    }
}
