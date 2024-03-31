import { NewsSource } from '../../definitions/NewsSource';

export class TechCrunchNewsSource extends NewsSource {
    constructor(
        id: string,
        title: string,
        image_url: string,
        description: string,
        link: string,
        source_id?: string
    ) {
        super(id, title, image_url, description, link, source_id)
    }

    public async getNews(): Promise<void> {

    }

    public async displayNews(): Promise<void> {

    }
}
