import { SectionBlock } from '@rocket.chat/ui-kit';

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
