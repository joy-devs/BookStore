CREATE TABLE IF NOT EXISTS "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"biography" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"author_id" integer NOT NULL,
	"publication_year" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "books" ADD CONSTRAINT "books_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
