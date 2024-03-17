import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export enum NewsSetting {
    NewsChannel = "news_channels",
    NewsSource = "news_source",
}

export const settings: Array<ISetting> = [
    {
        id: NewsSetting.NewsChannel,
        section: "NewsSettings",
        public: false,
        type: SettingType.STRING,
        value: "general",
        packageValue: "",
        hidden: false,
        i18nLabel: "Channels configured",
        i18nDescription: "This is where all the channels are configured in which the news-app will work",
        i18nPlaceholder: "Enter allowed channels (Comma Separated)",
        required: false,
    },
    {
        id: NewsSetting.NewsSource,
        section: "NewsSettings",
        public: false,
        type: SettingType.MULTI_SELECT,
        values: [
            {"key": "techcrunch", "i18nLabel": "TechCrunch"},
            {"key": "bbc", "i18nLabel": "BBC"},
            {"key": "gnews", "i18nLabel": "GNews"},
        ],
        packageValue: "",
        hidden: false,
        i18nLabel: "Sources",
        i18nDescription: "This is where all the news sources are configured",
        i18nPlaceholder: "Select news sources",
        required: false,
    },
]
