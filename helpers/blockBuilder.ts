import { ImageBlock, SectionBlock } from '@rocket.chat/ui-kit';

export function getSectionBlock(
    labelText: string,
    accessory?: any,
) {
    const block: SectionBlock = {
        type: "section",
        text: {
            type: "plain_text",
            text: labelText,
            emoji: true,
        },
        accessory: accessory,
    };
    return block;
}

export function getImageBlock(
    newsTitle: string,
    newsImage: string,
) {
    const block: ImageBlock = {
        type: "image",
        imageUrl: newsImage,
        altText: newsTitle,
    }

    return block;
}
