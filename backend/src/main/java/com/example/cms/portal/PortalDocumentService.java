package com.example.cms.portal;
import com.example.cms.content.document.*;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class PortalDocumentService { private final DocumentRepository docs; public PortalDocumentService(DocumentRepository docs){this.docs=docs;} public List<DocumentDto> documents(){return docs.portalList();} public DocumentDto get(Long id){return docs.findPortal(id);} }
