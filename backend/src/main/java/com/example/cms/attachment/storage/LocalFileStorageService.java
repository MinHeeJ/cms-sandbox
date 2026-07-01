package com.example.cms.attachment.storage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.*;import java.nio.file.*;import java.util.UUID;
@Service
public class LocalFileStorageService implements FileStorageService {
 private final Path root; public LocalFileStorageService(@Value("${cms.storage.local-path:/tmp/cms}") String path){this.root=Path.of(path).normalize();}
 public String store(String originalFileName, InputStream input)throws IOException{Files.createDirectories(root);String key=UUID.randomUUID()+"-"+Path.of(originalFileName).getFileName();Files.copy(input,root.resolve(key),StandardCopyOption.REPLACE_EXISTING);return key;}
 public InputStream read(String storageKey)throws IOException{return Files.newInputStream(root.resolve(Path.of(storageKey).getFileName()));}
}
