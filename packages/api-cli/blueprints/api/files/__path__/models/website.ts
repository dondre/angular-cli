
export let websiteSchema = {
    type: 'object',
    properties: {
        domain: { type: 'string', uniqueItems: true },
        categories: {},
        articles: {}
    },
    required: ['domain']
}