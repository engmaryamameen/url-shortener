-- CreateTable
CREATE TABLE "public"."links" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clicks" (
    "id" SERIAL NOT NULL,
    "linkId" INTEGER NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_slug_key" ON "public"."links"("slug");

-- AddForeignKey
ALTER TABLE "public"."clicks" ADD CONSTRAINT "clicks_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "public"."links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
