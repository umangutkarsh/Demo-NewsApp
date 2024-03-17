import { Block } from '@rocket.chat/ui-kit';
import { getSectionBlock } from '../helpers/blockBuilder';

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

    const newsImageBlock = getSectionBlock(newsImage);
    blocks.push(newsImageBlock);

    return blocks;
}
