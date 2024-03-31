export class NewsItem {
    id: string;
    title: string;
	description: string;
	link: string;
	image: string;
	source: string;
	author?: string;
	publishedAt?: string;

    constructor(
        id: string, title: string, description: string, link: string, image: string, source: string, author: string, publishedAt: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.link = link;
        this.image = image;
        this.source = source;
        this.author = author;
        this.publishedAt = publishedAt;
    }
}
