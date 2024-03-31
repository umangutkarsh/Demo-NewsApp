import { Block } from '@rocket.chat/ui-kit';
import { getImageBlock, getSectionBlock } from '../helpers/blockBuilder';

export async function buildNewsBlock(
    newsIndex: string,
    newsTitle: string,
    newsContent: string,
    newsImage: string,
) {
    const blocks: Block[] = [];

    const newsTitleBlock = getSectionBlock(newsTitle);
    blocks.push(newsTitleBlock);

    const newsContentBlock = getSectionBlock(newsContent);
    blocks.push(newsContentBlock);

    const newsImageBlock = getImageBlock(newsTitle, newsImage);
    blocks.push(newsImageBlock);

    return blocks;
}

export async function buildRSSNewsBlock(
    newsIndex: string,
    newsTitle: string,
    newsContent: string,
    newsLink: string,
    newsImage: string,
    newsSource: string,
    newsAuthor: string,
    newsPublishDate: string,
) {
    const blocks: Block[] = [];

    const newsTitleBlock = getSectionBlock(newsTitle);
    blocks.push(newsTitleBlock);

    const newsContentBlock = getSectionBlock(newsContent);
    blocks.push(newsContentBlock);

    const newsLinkBlock = getSectionBlock(newsLink);
    blocks.push(newsLinkBlock);

    // const newsImageBlock = getImageBlock(newsTitle, newsImage);
    // blocks.push(newsImageBlock);

    return blocks;
}

export async function buildTechCrunchNewsBlock(
    newsTitle: string,
    newsContent: string,
    newsLink: string,
    newsImage: string,
) {
    const blocks: Block[] = [];

    const newsTitleBlock = getSectionBlock(newsTitle);
    blocks.push(newsTitleBlock);

    const newsContentBlock = getSectionBlock(newsContent);
    blocks.push(newsContentBlock);

    const newsLinkBlock = getSectionBlock(newsLink);
    blocks.push(newsLinkBlock);

    const newsImageBlock = getImageBlock(newsTitle, newsImage);
    blocks.push(newsImageBlock);

    return blocks;
}
