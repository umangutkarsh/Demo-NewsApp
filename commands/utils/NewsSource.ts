export class NewsSource {
    public readonly id: string;
    public readonly title: string;
    public readonly image_url: string;
    public readonly description: string;
    public readonly link: string;
    public readonly source_id?: string;
    public readonly any_other_property?: string

    protected constructor(id: string,title: string,image_url: string,description: string,link: string, source_id?: string, any_other_property?: string) {
        this.id = id;
        this.title = title
        this.image_url = image_url;
        this.description = description;
        this.link = link;
        this.source_id = source_id;
        this.any_other_property = any_other_property;
    }

    async getNews(): Promise<void> {}

    async displayNews(): Promise<void> {}

    async storeNews(): Promise<void> {}
}
