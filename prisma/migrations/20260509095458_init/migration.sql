-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Document_level_branch_module_docType_idx" ON "Document"("level", "branch", "module", "docType");

-- CreateIndex
CREATE INDEX "Document_title_idx" ON "Document"("title");
