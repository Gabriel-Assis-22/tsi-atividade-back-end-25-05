-- CreateTable
CREATE TABLE "Genero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Plataforma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Jogo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "idGenero" INTEGER NOT NULL,
    CONSTRAINT "Jogo_idGenero_fkey" FOREIGN KEY ("idGenero") REFERENCES "Genero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_JogoToPlataforma" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_JogoToPlataforma_A_fkey" FOREIGN KEY ("A") REFERENCES "Jogo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_JogoToPlataforma_B_fkey" FOREIGN KEY ("B") REFERENCES "Plataforma" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_JogoToPlataforma_AB_unique" ON "_JogoToPlataforma"("A", "B");

-- CreateIndex
CREATE INDEX "_JogoToPlataforma_B_index" ON "_JogoToPlataforma"("B");
