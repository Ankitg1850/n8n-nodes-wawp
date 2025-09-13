import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

const EVENT_LIST = [
	'session.status',
	'message',
	'message.reaction',
	'message.any',
	'message.ack',
	'message.revoked',
	'message.edited',
	'group.v2.join',
	'group.v2.leave',
	'group.v2.update',
	'group.v2.participants',
	'presence.update',
	'poll.vote.failed',
	'chat.archive',
	'call.received',
	'call.accepted',
	'call.rejected',
	'label.upsert',
	'label.deleted',
	'label.chat.added',
	'label.chat.deleted',
	'event.response',
	'event.response.failed',
	'engine.event',
] as const;

type WawpEvent = (typeof EVENT_LIST)[number];

export class WawpTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wawp Trigger',
		name: 'wawpTrigger',
		icon: 'file:wawp.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when Wawp sends a webhook',
		defaults: { name: 'Wawp Trigger' },

		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{$parameter["path"]}}',
			},
		],

		// One output per event + 1st output is "any"
		outputs: Array(EVENT_LIST.length + 1).fill('main'),
		outputNames: ['any', ...EVENT_LIST],

		inputs: [],

		properties: [
			{
				displayName: 'Webhook Path',
				name: 'path',
				type: 'string',
				default: 'wawp',
				placeholder: 'wawp',
				description:
					'Final URL: &lt;base&gt;/webhook/&lt;path&gt; (or /webhook-test/&lt;path&gt; in test mode)',
			},
			{
				displayName: 'Heads-Up',
				name: 'eventsInfo',
				type: 'string',
				default:
`Events:
- ${EVENT_LIST.join('\n- ')}
Remember to configure your Wawp instance to POST events to this webhook URL.`,
				typeOptions: { rows: 18 },
				noDataExpression: true,
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions) {
				return true;
			},
			async create(this: IHookFunctions) {
				return true;
			},
			async delete(this: IHookFunctions) {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();

		let body: unknown = req.body;
		if (typeof body === 'string') {
			try {
				body = JSON.parse(body);
			} catch {}
		}
		const itemsIn = Array.isArray(body) ? body : [body];

		// Prepare one array per output:
		// index 0 => 'any'
		// index (EVENT_LIST.indexOf(ev) + 1) => that event output
		const out: Array<{ json: IDataObject }[]> = Array(EVENT_LIST.length + 1)
			.fill(0)
			.map(() => []);

		for (const entry of itemsIn) {
			const obj =
				typeof entry === 'object' && entry !== null
					? (entry as IDataObject)
					: ({ payload: entry } as IDataObject);

			const ev = typeof obj.event === 'string' ? obj.event : undefined;

			// Push to "any"
			out[0].push({ json: obj });

			// Push to specific event output if matched
			if (ev) {
				const idx = EVENT_LIST.indexOf(ev as WawpEvent);
				if (idx >= 0) out[idx + 1].push({ json: obj });
			}
		}

		// Let n8n handle the HTTP response (good for manual test + prod)
		return { workflowData: out };
	}
}
