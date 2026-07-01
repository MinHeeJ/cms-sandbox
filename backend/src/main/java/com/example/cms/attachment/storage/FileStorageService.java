package com.example.cms.attachment.storage;
import java.io.*;
public interface FileStorageService { String store(String originalFileName, InputStream input) throws IOException; InputStream read(String storageKey) throws IOException; }
