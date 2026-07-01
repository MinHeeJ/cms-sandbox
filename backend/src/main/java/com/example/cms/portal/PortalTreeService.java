package com.example.cms.portal;
import com.example.cms.content.folder.*;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class PortalTreeService { private final FolderService folders; public PortalTreeService(FolderService folders){this.folders=folders;} public List<FolderDto> tree(){return folders.tree();} }
