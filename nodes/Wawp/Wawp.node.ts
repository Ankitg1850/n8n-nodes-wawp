import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

/** Category-specific operation unions */
type SessionsOp =
	| 'createSession'
	| 'startSession'
	| 'stopSession'
	| 'restartSession'
	| 'deleteSession'
	| 'logoutSession'
	| 'getSessionInfo'
	| 'getSessionMe';

type AuthOp = 'getQrRaw' | 'getQrImage' | 'requestCode';

type SendOp =
	| 'sendText'
	| 'sendImage'
	| 'sendPdf'
	| 'sendVoice'
	| 'sendVideo'
	| 'sendLocation'
	| 'sendPoll'
	| 'sendContactVcard'
	| 'sendSeen'
	| 'startTyping'
	| 'stopTyping'
	| 'reaction'
	| 'star';

type PresenceOp = 'presenceSet' | 'presenceGetByChatId';

type LabelsOp =
	| 'labelsList'
	| 'labelCreate'
	| 'labelUpdate'
	| 'labelDelete'
	| 'labelsForChatGet'
	| 'labelsForChatSave'
	| 'chatsWithLabel';

type ProfileOp =
	| 'profileGet'
	| 'profileSetName'
	| 'profileSetStatus'
	| 'profileUploadPicture'
	| 'profileDeletePicture';

type ChannelsOp =
	| 'channelsList'
	| 'channelsCreate'
	| 'channelsGet'
	| 'channelsDelete'
	| 'channelsPreviewMessages'
	| 'channelsFollow'
	| 'channelsUnfollow'
	| 'channelsMute'
	| 'channelsUnmute'
	| 'channelsSearchByView'
	| 'channelsSearchByText'
	| 'channelsSearchViews'
	| 'channelsSearchCountries'
	| 'channelsSearchCategories';

type ChatsOp =
	| 'chatsList'
	| 'chatsOverview'
	| 'chatDelete'
	| 'chatPicture'
	| 'chatMessagesGet'
	| 'chatMessagesClear'
	| 'chatMessagesRead'
	| 'chatMessageGetById'
	| 'chatMessageDelete'
	| 'chatMessageEdit'
	| 'chatMessagePin'
	| 'chatMessageUnpin'
	| 'chatArchive'
	| 'chatUnarchive'
	| 'chatMarkUnread';

type StatusOp = 'statusText' | 'statusImage' | 'statusVoice' | 'statusVideo' | 'statusDelete';

type ContactsOp =
	| 'contactsAll'
	| 'contactGet'
	| 'contactCheckExists'
	| 'contactAbout'
	| 'contactProfilePicture'
	| 'contactBlock'
	| 'contactUnblock'
	| 'contactUpsert';

type LidsOp = 'lidsList' | 'lidsCount';

/** 👥 Groups — extended */
type GroupsOp =
	| 'groupsList'
	| 'groupCreate'
	| 'groupsJoinInfo'
	| 'groupsJoin'
	| 'groupsCount'
	| 'groupsRefresh'
	| 'groupGet'
	| 'groupDelete'
	| 'groupLeave'
	| 'groupPictureGet'
	| 'groupPictureSet'
	| 'groupPictureDelete'
	| 'groupDescriptionUpdate'
	| 'groupSubjectUpdate'
	| 'groupInfoAdminOnlyGet'
	| 'groupInfoAdminOnlySet'
	| 'groupMessagesAdminOnlyGet'
	| 'groupMessagesAdminOnlySet'
	| 'groupInviteCodeGet'
	| 'groupInviteCodeRevoke'
	| 'groupParticipantsGet'
	| 'groupParticipantsAdd'
	| 'groupParticipantsRemove'
	| 'groupAdminPromote'
	| 'groupAdminDemote';

export class Wawp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wawp',
		name: 'wawp',
		icon: 'file:wawp.svg',
		group: ['transform'],
		version: 1,
		description: 'Manage sessions, authenticate, and send messages via Wawp',
		defaults: { name: 'Wawp' },

		// keep single in/out to avoid editor issues
		inputs: ['main'] as NodeConnectionType[],
outputs: ['main'] as NodeConnectionType[],

		credentials: [{ name: 'wawpNumberApi', required: true }],

		properties: [
			/* =========================
			   CATEGORY
			========================= */
			{
				displayName: 'Category',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'sessions',
				options: [
					{ name: '⛓️‍💥 Session – Instance', value: 'sessions' },
					{ name: '📲 Authentication – Login', value: 'auth' },
					{ name: '📤 Send Message', value: 'sendMessages' },
					{ name: '🟢 Presence Information', value: 'presence' },
					{ name: '🏷️ Label', value: 'labels' },
					{ name: 'ℹ️ WhatsApp Profile Info', value: 'profile' },
					{ name: '📢 Channels Control', value: 'channels' },
					{ name: '💬 Chat', value: 'chats' },
					{ name: '🔊 24 Hour Status', value: 'status24h' },
					{ name: '🪪 Contact', value: 'contacts' },
					{ name: '🪪 LID', value: 'lids' },
					{ name: '👥 Group', value: 'groups' },
				],
			},

			/* =========================
			   OPERATIONS (per category)
			========================= */

			// Sessions operations
			{
				displayName: 'Operation',
				name: 'operationSessions',
				type: 'options',
				displayOptions: { show: { resource: ['sessions'] } },
				default: 'createSession',
				options: [
					{ name: 'Create Session', value: 'createSession', description: 'POST /createSession' },
					{ name: 'Start Session', value: 'startSession', description: 'POST /session/start' },
					{ name: 'Stop Session', value: 'stopSession', description: 'POST /session/stop' },
					{ name: 'Restart Session', value: 'restartSession', description: 'POST /session/restart' },
					{ name: 'Delete Session', value: 'deleteSession', description: 'DELETE /session/delete' },
					{ name: 'Logout Session', value: 'logoutSession', description: 'GET /session/logout' },
					{ name: 'Get Session Info', value: 'getSessionInfo', description: 'GET /session/info' },
					{ name: 'About WhatsApp Data (Me)', value: 'getSessionMe', description: 'GET /session/me' },
				],
			},

			// Auth operations
			{
				displayName: 'Operation',
				name: 'operationAuth',
				type: 'options',
				displayOptions: { show: { resource: ['auth'] } },
				default: 'getQrRaw',
				options: [
					{ name: 'Get QR (Raw)', value: 'getQrRaw', description: 'GET /getQr?format=raw' },
					{ name: 'Get QR (Image)', value: 'getQrImage', description: 'GET /getQr' },
					{ name: 'Request Code', value: 'requestCode', description: 'POST /requestCode' },
				],
			},

			// Send operations
			{
				displayName: 'Operation',
				name: 'operationSend',
				type: 'options',
				displayOptions: { show: { resource: ['sendMessages'] } },
				default: 'sendText',
				options: [
					{ name: 'Send Text', value: 'sendText' },
					{ name: 'Send Image', value: 'sendImage' },
					{ name: 'Send PDF', value: 'sendPdf' },
					{ name: 'Send Voice', value: 'sendVoice' },
					{ name: 'Send Video', value: 'sendVideo' },
					{ name: 'Send Location', value: 'sendLocation' },
					{ name: 'Send Poll', value: 'sendPoll' },
					{ name: 'Send Contact Vcard', value: 'sendContactVcard' },
					{ name: 'Mark Seen', value: 'sendSeen' },
					{ name: 'Start Typing', value: 'startTyping' },
					{ name: 'Stop Typing', value: 'stopTyping' },
					{ name: 'Reaction', value: 'reaction' },
					{ name: 'Star Message', value: 'star' },
				],
			},

			// Presence operations
			{
				displayName: 'Operation',
				name: 'operationPresence',
				type: 'options',
				displayOptions: { show: { resource: ['presence'] } },
				default: 'presenceSet',
				options: [
					{ name: 'Set Presence', value: 'presenceSet', description: 'POST /presence' },
					{ name: 'Get Presence by Chat ID', value: 'presenceGetByChatId', description: 'GET /presence/{chatId}' },
				],
			},

			// Labels operations
			{
				displayName: 'Operation',
				name: 'operationLabels',
				type: 'options',
				displayOptions: { show: { resource: ['labels'] } },
				default: 'labelsList',
				options: [
					{ name: 'List Labels', value: 'labelsList', description: 'GET /labels' },
					{ name: 'Create Label', value: 'labelCreate', description: 'POST /labels' },
					{ name: 'Update Label', value: 'labelUpdate', description: 'PUT /labels/{labelId}' },
					{ name: 'Delete Label', value: 'labelDelete', description: 'DELETE /labels/{labelId}' },
					{ name: 'Labels for a Chat', value: 'labelsForChatGet', description: 'GET /labels/chats/{chatId}' },
					{ name: 'Save Labels for a Chat', value: 'labelsForChatSave', description: 'PUT /labels/chats/{chatId}' },
					{ name: 'Chats with a Label', value: 'chatsWithLabel', description: 'GET /labels/{labelId}/chats' },
				],
			},

			// Profile operations
			{
				displayName: 'Operation',
				name: 'operationProfile',
				type: 'options',
				displayOptions: { show: { resource: ['profile'] } },
				default: 'profileGet',
				options: [
					{ name: 'Get Profile', value: 'profileGet', description: 'GET /profile' },
					{ name: 'Set Display Name', value: 'profileSetName', description: 'PUT /profile/nameRequest' },
					{ name: 'Set “About” Status', value: 'profileSetStatus', description: 'PUT /profile/status' },
					{ name: 'Upload Picture', value: 'profileUploadPicture', description: 'PUT /profile/picture' },
					{ name: 'Delete Picture', value: 'profileDeletePicture', description: 'DELETE /profile/picture' },
				],
			},

			// Channels operations
			{
				displayName: 'Operation',
				name: 'operationChannels',
				type: 'options',
				displayOptions: { show: { resource: ['channels'] } },
				default: 'channelsList',
				options: [
					{ name: 'List Channels', value: 'channelsList', description: 'GET /channels' },
					{ name: 'Create Channel', value: 'channelsCreate', description: 'POST /channels' },
					{ name: 'Get Channel', value: 'channelsGet', description: 'GET /channels/{ID}' },
					{ name: 'Delete Channel', value: 'channelsDelete', description: 'DELETE /channels/{ID}' },
					{ name: 'Preview Messages', value: 'channelsPreviewMessages', description: 'GET /channels/{ID}/messages/preview' },
					{ name: 'Follow Channel', value: 'channelsFollow', description: 'POST /channels/{ID}/follow' },
					{ name: 'Unfollow Channel', value: 'channelsUnfollow', description: 'POST /channels/{ID}/unfollow' },
					{ name: 'Mute Channel', value: 'channelsMute', description: 'POST /channels/{ID}/mute' },
					{ name: 'Unmute Channel', value: 'channelsUnmute', description: 'POST /channels/{ID}/unmute' },
					{ name: 'Search by View', value: 'channelsSearchByView', description: 'GET /channels/search?view=' },
					{ name: 'Search by Text', value: 'channelsSearchByText', description: 'GET /channels/search?text=' },
					{ name: 'Search Metadata: Views', value: 'channelsSearchViews', description: 'GET /channels/search/views' },
					{ name: 'Search Metadata: Countries', value: 'channelsSearchCountries', description: 'GET /channels/search/countries' },
					{ name: 'Search Metadata: Categories', value: 'channelsSearchCategories', description: 'GET /channels/search/categories' },
				],
			},

			// Chats operations
			{
				displayName: 'Operation',
				name: 'operationChats',
				type: 'options',
				displayOptions: { show: { resource: ['chats'] } },
				default: 'chatsList',
				options: [
					{ name: 'Chats List', value: 'chatsList', description: 'POST /chats' },
					{ name: 'Chats Overview', value: 'chatsOverview', description: 'GET /chats/overview' },
					{ name: 'Delete Chat', value: 'chatDelete', description: 'DELETE /chats/{chatId}' },
					{ name: 'Get Chat Picture', value: 'chatPicture', description: 'GET /chats/{chatId}/picture' },
					{ name: 'Get Messages', value: 'chatMessagesGet', description: 'GET /chats/{chatId}/messages' },
					{ name: 'Clear All Messages', value: 'chatMessagesClear', description: 'DELETE /chats/{chatId}/messages' },
					{ name: 'Mark Unread as Read', value: 'chatMessagesRead', description: 'POST /chats/{chatId}/messages/read' },
					{ name: 'Get Message by ID', value: 'chatMessageGetById', description: 'POST /chats/{chatId}/messages/{messageId}' },
					{ name: 'Delete Message', value: 'chatMessageDelete', description: 'DELETE /chats/{chatId}/messages/{messageId}' },
					{ name: 'Edit Message', value: 'chatMessageEdit', description: 'PUT /chats/{chatId}/messages/{messageId}' },
					{ name: 'Pin Message', value: 'chatMessagePin', description: 'POST /chats/{chatId}/messages/{messageId}/pin' },
					{ name: 'Unpin Message', value: 'chatMessageUnpin', description: 'POST /chats/{chatId}/messages/{messageId}/unpin' },
					{ name: 'Archive Chat', value: 'chatArchive', description: 'POST /chats/{chatId}/archive' },
					{ name: 'Unarchive Chat', value: 'chatUnarchive', description: 'POST /chats/{chatId}/unarchive' },
					{ name: 'Mark Chat Unread', value: 'chatMarkUnread', description: 'POST /chats/{chatId}/unread' },
				],
			},

			// Status (24h) operations
			{
				displayName: 'Operation',
				name: 'operationStatus',
				type: 'options',
				displayOptions: { show: { resource: ['status24h'] } },
				default: 'statusText',
				options: [
					{ name: 'Text Status', value: 'statusText', description: 'POST /status/text' },
					{ name: 'Image Status', value: 'statusImage', description: 'POST /status/image' },
					{ name: 'Voice Status', value: 'statusVoice', description: 'POST /status/voice' },
					{ name: 'Video Status', value: 'statusVideo', description: 'POST /status/video' },
					{ name: 'Delete Status', value: 'statusDelete', description: 'POST /status/delete' },
				],
			},

			// Contacts operations
			{
				displayName: 'Operation',
				name: 'operationContacts',
				type: 'options',
				displayOptions: { show: { resource: ['contacts'] } },
				default: 'contactsAll',
				options: [
					{ name: 'List Contacts (All)', value: 'contactsAll', description: 'GET /contacts/all' },
					{ name: 'Get Contact', value: 'contactGet', description: 'GET /contacts' },
					{ name: 'Check Phone Exists', value: 'contactCheckExists', description: 'GET /contacts/check-exists' },
					{ name: 'Get Contact About', value: 'contactAbout', description: 'GET /contacts/about' },
					{ name: 'Contact Profile Picture', value: 'contactProfilePicture', description: 'GET /contacts/profile-picture' },
					{ name: 'Block Contact', value: 'contactBlock', description: 'POST /contacts/block' },
					{ name: 'Unblock Contact', value: 'contactUnblock', description: 'POST /contacts/unblock' },
					{ name: 'Upsert Contact in Address Book', value: 'contactUpsert', description: 'PUT /contacts/{contactId}' },
				],
			},

			// LIDs operations
			{
				displayName: 'Operation',
				name: 'operationLids',
				type: 'options',
				displayOptions: { show: { resource: ['lids'] } },
				default: 'lidsList',
				options: [
					{ name: 'List LIDs', value: 'lidsList', description: 'GET /lids' },
					{ name: 'Count LIDs', value: 'lidsCount', description: 'GET /lids/count' },
				],
			},

			// Groups operations (extended)
			{
				displayName: 'Operation',
				name: 'operationGroups',
				type: 'options',
				displayOptions: { show: { resource: ['groups'] } },
				default: 'groupsList',
				options: [
					{ name: 'List Groups', value: 'groupsList', description: 'GET /groups' },
					{ name: 'Create Group', value: 'groupCreate', description: 'POST /groups' },
					{ name: 'Join Info (by code/URL)', value: 'groupsJoinInfo', description: 'GET /groups/join-info?code=' },
					{ name: 'Join Group', value: 'groupsJoin', description: 'POST /groups/join' },
					{ name: 'Groups Count', value: 'groupsCount', description: 'GET /groups/count' },
					{ name: 'Refresh Groups', value: 'groupsRefresh', description: 'POST /groups/refresh' },
					{ name: 'Get Group', value: 'groupGet', description: 'GET /groups/{ID}' },
					{ name: 'Delete Group', value: 'groupDelete', description: 'DELETE /groups/{ID}' },
					{ name: 'Leave Group', value: 'groupLeave', description: 'POST /groups/{ID}/leave' },
					{ name: 'Get Group Picture', value: 'groupPictureGet', description: 'GET /groups/{ID}/picture' },
					{ name: 'Set Group Picture', value: 'groupPictureSet', description: 'PUT /groups/{ID}/picture' },
					{ name: 'Delete Group Picture', value: 'groupPictureDelete', description: 'DELETE /groups/{ID}/picture' },
					{ name: 'Update Description', value: 'groupDescriptionUpdate', description: 'PUT /groups/{ID}/description' },
					{ name: 'Update Subject', value: 'groupSubjectUpdate', description: 'PUT /groups/{ID}/subject' },
					{ name: 'Info Admin Only (Get)', value: 'groupInfoAdminOnlyGet', description: 'GET /groups/{ID}/settings/security/info-admin-only' },
					{ name: 'Info Admin Only (Set)', value: 'groupInfoAdminOnlySet', description: 'PUT /groups/{ID}/settings/security/info-admin-only' },
					{ name: 'Messages Admin Only (Get)', value: 'groupMessagesAdminOnlyGet', description: 'GET /groups/{ID}/settings/security/messages-admin-only' },
					{ name: 'Messages Admin Only (Set)', value: 'groupMessagesAdminOnlySet', description: 'PUT /groups/{ID}/settings/security/messages-admin-only' },
					{ name: 'Invite Code (Get)', value: 'groupInviteCodeGet', description: 'GET /groups/{ID}/invite-code' },
					{ name: 'Invite Code (Revoke)', value: 'groupInviteCodeRevoke', description: 'POST /groups/{ID}/invite-code/revoke' },
					{ name: 'Participants (Get)', value: 'groupParticipantsGet', description: 'GET /groups/{ID}/participants' },
					{ name: 'Participants (Add)', value: 'groupParticipantsAdd', description: 'POST /groups/{ID}/participants/add' },
					{ name: 'Participants (Remove)', value: 'groupParticipantsRemove', description: 'POST /groups/{ID}/participants/remove' },
					{ name: 'Admins (Promote)', value: 'groupAdminPromote', description: 'POST /groups/{ID}/admin/promote' },
					{ name: 'Admins (Demote)', value: 'groupAdminDemote', description: 'POST /groups/{ID}/admin/demote' },
				],
			},

			/* =========================
			   FIELDS (only shown where needed)
			========================= */

			// Sessions
			{
				displayName: 'Session Name',
				name: 'sessionName',
				type: 'string',
				required: true,
				default: 'MyNewSession',
				displayOptions: { show: { resource: ['sessions'], operationSessions: ['createSession'] } },
			},

			// Auth
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				required: true,
				default: '',
				placeholder: '447441429009',
				displayOptions: { show: { resource: ['auth'], operationAuth: ['requestCode'] } },
			},

			// Send – common chatId
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				required: true,
				default: '',
				placeholder: '447441429009 or 447441429009@c.us',
				displayOptions: {
					show: {
						resource: ['sendMessages'],
						operationSend: [
							'sendText','sendImage','sendPdf','sendVoice','sendVideo','sendLocation',
							'sendPoll','sendContactVcard','sendSeen','startTyping','stopTyping','reaction','star',
						],
					},
				},
			},

			// Send Text
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: { rows: 3 },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendText'] } },
			},

			// Send Image
			{ displayName: 'Image URL', name: 'fileUrl', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendImage'] } } },
			{ displayName: 'Filename', name: 'fileName', type: 'string', required: true, default: 'image.jpg',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendImage'] } } },
			{ displayName: 'MIME Type', name: 'fileMime', type: 'string', required: true, default: 'image/jpeg',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendImage'] } } },
			{ displayName: 'Caption', name: 'caption', type: 'string', default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendImage'] } } },

			// Send PDF
			{ displayName: 'PDF URL', name: 'pdfUrl', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendPdf'] } } },
			{ displayName: 'Filename', name: 'pdfName', type: 'string', required: true, default: 'document.pdf',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendPdf'] } } },
			{ displayName: 'MIME Type', name: 'pdfMime', type: 'string', required: true, default: 'application/pdf',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendPdf'] } } },
			{ displayName: 'Caption', name: 'pdfCaption', type: 'string', default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendPdf'] } } },

			// Send Voice
			{ displayName: 'Voice URL', name: 'voiceUrl', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVoice'] } } },
			{ displayName: 'Filename', name: 'voiceName', type: 'string', required: true, default: 'note.ogg',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVoice'] } } },
			{ displayName: 'MIME Type', name: 'voiceMime', type: 'string', required: true, default: 'audio/ogg; codecs=opus',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVoice'] } } },
			{ displayName: 'Convert', name: 'voiceConvert', type: 'boolean', default: true,
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVoice'] } } },

			// Send Video
			{ displayName: 'Video URL', name: 'videoUrl', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVideo'] } } },
			{ displayName: 'Filename', name: 'videoName', type: 'string', required: true, default: 'video.mp4',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVideo'] } } },
			{ displayName: 'MIME Type', name: 'videoMime', type: 'string', required: true, default: 'video/mp4',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVideo'] } } },
			{ displayName: 'Caption', name: 'videoCaption', type: 'string', default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVideo'] } } },
			{ displayName: 'Convert', name: 'videoConvert', type: 'boolean', default: true,
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVideo'] } } },
			{ displayName: 'Send as Note', name: 'videoAsNote', type: 'boolean', default: false,
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendVideo'] } } },

			// Send Location
			{ displayName: 'Latitude', name: 'latitude', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendLocation'] } } },
			{ displayName: 'Longitude', name: 'longitude', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendLocation'] } } },
			{ displayName: 'Title', name: 'locationTitle', type: 'string', default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendLocation'] } } },
			{ displayName: 'Message', name: 'locationMessage', type: 'string', default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendLocation'] } } },
			{ displayName: 'Reply To (Message ID)', name: 'replyTo', type: 'string', default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendLocation'] } } },

			// Send Poll
			{ displayName: 'Poll Question', name: 'pollName', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendPoll'] } } },
			{ displayName: 'Options (Comma-Separated)', name: 'pollOptions', type: 'string', required: true, default: 'Option A, Option B',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendPoll'] } } },
			{ displayName: 'Multiple Answers', name: 'pollMultiple', type: 'boolean', default: false,
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendPoll'] } } },

			// Send Contact Vcard
			{ displayName: 'Contacts (JSON)', name: 'contactsJson', type: 'string', typeOptions: { rows: 6 }, required: true, default: '[]',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendContactVcard'] } } },

			// Seen / Typing / Reaction / Star
			{ displayName: 'Message IDs (Comma Separated)', name: 'seenMessageIds', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendSeen'] } } },
			{ displayName: 'Participant (Optional)', name: 'seenParticipant', type: 'string', default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['sendSeen'] } } },
			{ displayName: 'Message ID', name: 'reactionMessageId', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['reaction'] } } },
			{ displayName: 'Reaction', name: 'reaction', type: 'string', required: true, default: '👍',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['reaction'] } } },
			{ displayName: 'Message ID', name: 'starMessageId', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['star'] } } },
			{ displayName: 'Star', name: 'starFlag', type: 'boolean', default: true,
				displayOptions: { show: { resource: ['sendMessages'], operationSend: ['star'] } } },

			// Presence
			{
				displayName: 'Presence',
				name: 'presenceValue',
				type: 'options',
				default: 'online',
				options: [
					{ name: 'Online', value: 'online' },
					{ name: 'Typing', value: 'composing' },
					{ name: 'Recording', value: 'recording' },
					{ name: 'Paused', value: 'paused' },
					{ name: 'Unavailable', value: 'unavailable' },
				],
				displayOptions: { show: { resource: ['presence'], operationPresence: ['presenceSet'] } },
			},
			{
				displayName: 'Chat ID',
				name: 'presenceChatId',
				type: 'string',
				required: true,
				default: '',
				placeholder: '447441429009@c.us',
				displayOptions: { show: { resource: ['presence'], operationPresence: ['presenceGetByChatId'] } },
			},

			// Labels
			{
				displayName: 'Label ID',
				name: 'labelId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['labels'], operationLabels: ['labelUpdate', 'labelDelete', 'chatsWithLabel'] },
				},
			},
			{
				displayName: 'Name',
				name: 'labelName',
				type: 'string',
				required: true,
				default: 'Lead',
				displayOptions: {
					show: { resource: ['labels'], operationLabels: ['labelCreate', 'labelUpdate'] },
				},
			},
			{
				displayName: 'Color Hex',
				name: 'labelColorHex',
				type: 'color',
				required: true,
				default: '#ff9485',
				displayOptions: {
					show: { resource: ['labels'], operationLabels: ['labelCreate', 'labelUpdate'] },
				},
			},
			{
				displayName: 'Chat ID',
				name: 'labelsChatId',
				type: 'string',
				required: true,
				default: '',
				placeholder: '447441429009@c.us',
				displayOptions: {
					show: {
						resource: ['labels'],
						operationLabels: ['labelsForChatGet', 'labelsForChatSave'],
					},
				},
			},
			{
				displayName: 'Labels JSON',
				name: 'labelsJson',
				type: 'string',
				typeOptions: { rows: 4 },
				default: `{"labels":[{"id":"1"},{"id":"7"}]}`,
				description: 'Payload for Save Labels for a Chat',
				displayOptions: { show: { resource: ['labels'], operationLabels: ['labelsForChatSave'] } },
			},

			// Profile
			{
				displayName: 'Display Name',
				name: 'profileDisplayName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['profile'], operationProfile: ['profileSetName'] } },
			},
			{
				displayName: 'Status (“About”)',
				name: 'profileStatus',
				type: 'string',
				required: true,
				default: 'Busy',
				displayOptions: { show: { resource: ['profile'], operationProfile: ['profileSetStatus'] } },
			},
			{
				displayName: 'Picture URL',
				name: 'profilePicUrl',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['profile'], operationProfile: ['profileUploadPicture'] } },
			},
			{
				displayName: 'Picture Filename',
				name: 'profilePicName',
				type: 'string',
				required: true,
				default: 'me.jpg',
				displayOptions: { show: { resource: ['profile'], operationProfile: ['profileUploadPicture'] } },
			},
			{
				displayName: 'Picture MIME Type',
				name: 'profilePicMime',
				type: 'string',
				required: true,
				default: 'image/jpeg',
				displayOptions: { show: { resource: ['profile'], operationProfile: ['profileUploadPicture'] } },
			},

			// Channels
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['channels'],
						operationChannels: [
							'channelsGet','channelsDelete','channelsPreviewMessages',
							'channelsFollow','channelsUnfollow','channelsMute','channelsUnmute',
						],
					},
				},
			},
			{
				displayName: 'Role',
				name: 'channelsRole',
				type: 'options',
				default: '',
				options: [
					{ name: '— (All)', value: '' },
					{ name: 'OWNER', value: 'OWNER' },
					{ name: 'ADMIN', value: 'ADMIN' },
					{ name: 'SUBSCRIBER', value: 'SUBSCRIBER' },
				],
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsList'] } },
			},
			{
				displayName: 'Channel Name (Optional)',
				name: 'channelsName',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsGet'] } },
			},
			// Create channel body
			{
				displayName: 'Name',
				name: 'channelCreateName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsCreate'] } },
			},
			{
				displayName: 'Description',
				name: 'channelCreateDesc',
				type: 'string',
				required: true,
				default: '',
				typeOptions: { rows: 3 },
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsCreate'] } },
			},
			{
				displayName: 'Picture URL',
				name: 'channelPicUrl',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsCreate'] } },
			},
			{
				displayName: 'Picture Filename',
				name: 'channelPicName',
				type: 'string',
				required: true,
				default: 'filename.jpg',
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsCreate'] } },
			},
			{
				displayName: 'Picture MIME Type',
				name: 'channelPicMime',
				type: 'string',
				required: true,
				default: 'image/jpeg',
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsCreate'] } },
			},
			{
				displayName: 'Type',
				name: 'channelType',
				type: 'string',
				required: true,
				default: 'string',
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsCreate'] } },
			},
			// Preview params
			{
				displayName: 'Download Media',
				name: 'channelsPreviewDownload',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsPreviewMessages'] } },
			},
			{
				displayName: 'Limit',
				name: 'channelsPreviewLimit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 200 },
				default: 50,
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsPreviewMessages'] } },
			},
			// Search by view / text
			{
				displayName: 'View',
				name: 'channelsView',
				type: 'string',
				default: 'RECOMMENDED',
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsSearchByView'] } },
			},
			{
				displayName: 'Countries (Comma-Separated)',
				name: 'channelsCountries',
				type: 'string',
				default: 'US',
				displayOptions: {
					show: { resource: ['channels'], operationChannels: ['channelsSearchByView','channelsSearchByText'] },
				},
			},
			{
				displayName: 'Categories (Comma-Separated)',
				name: 'channelsCategories',
				type: 'string',
				default: '',
				displayOptions: {
					show: { resource: ['channels'], operationChannels: ['channelsSearchByView','channelsSearchByText'] },
				},
			},
			{
				displayName: 'Limit',
				name: 'channelsSearchLimit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 1000 },
				default: 50,
				displayOptions: {
					show: { resource: ['channels'], operationChannels: ['channelsSearchByView','channelsSearchByText'] },
				},
			},
			{
				displayName: 'Start Cursor',
				name: 'channelsStartCursor',
				type: 'string',
				default: '',
				displayOptions: {
					show: { resource: ['channels'], operationChannels: ['channelsSearchByView','channelsSearchByText'] },
				},
			},
			{
				displayName: 'Text',
				name: 'channelsSearchText',
				type: 'string',
				required: true,
				default: 'Elon Task',
				displayOptions: { show: { resource: ['channels'], operationChannels: ['channelsSearchByText'] } },
			},

			/* ---------- Chats fields ---------- */
			{
				displayName: 'Chat ID',
				name: 'chatsChatId',
				type: 'string',
				required: true,
				default: '',
				placeholder: '447441429009@c.us',
				displayOptions: {
					show: {
						resource: ['chats'],
						operationChats: [
							'chatDelete','chatPicture','chatMessagesGet','chatMessagesClear',
							'chatMessagesRead','chatMessageGetById','chatMessageDelete','chatMessageEdit',
							'chatMessagePin','chatMessageUnpin','chatArchive','chatUnarchive','chatMarkUnread',
						],
					},
				},
			},
			{
				displayName: 'Sort By',
				name: 'chatsSortBy',
				type: 'string',
				default: 'id',
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatsList'] } },
			},
			{
				displayName: 'Sort Order',
				name: 'chatsSortOrder',
				type: 'options',
				default: 'DESC',
				options: [
					{ name: 'ASC', value: 'ASC' },
					{ name: 'DESC', value: 'DESC' },
				],
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatsList'] } },
			},
			{
				displayName: 'Limit',
				name: 'chatsLimit',
				type: 'number',
				default: 50,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatsList','chatsOverview'] } },
			},
			{
				displayName: 'Offset',
				name: 'chatsOffset',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatsList','chatsOverview'] } },
			},
			{
				displayName: 'IDs (Comma-Separated)',
				name: 'chatsOverviewIds',
				type: 'string',
				default: '',
				description: 'Filter overview by chat IDs',
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatsOverview'] } },
			},
			{
				displayName: 'Refresh (Bust 24h Cache)',
				name: 'chatPictureRefresh',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatPicture'] } },
			},
			{
				displayName: 'Download Media',
				name: 'chatMsgDownload',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagesGet'] } },
			},
			{
				displayName: 'Limit',
				name: 'chatMsgLimit',
				type: 'number',
				default: 50,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagesGet'] } },
			},
			{
				displayName: 'Offset',
				name: 'chatMsgOffset',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagesGet'] } },
			},
			{
				displayName: 'Timestamp ≤ (Unix Seconds)',
				name: 'chatMsgTsLte',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagesGet'] } },
			},
			{
				displayName: 'Timestamp ≥ (Unix Seconds)',
				name: 'chatMsgTsGte',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagesGet'] } },
			},
			{
				displayName: 'From Me',
				name: 'chatMsgFromMe',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagesGet'] } },
			},
			{
				displayName: 'ACK',
				name: 'chatMsgAck',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagesGet'] } },
			},
			{
				displayName: 'Messages (Latest N)',
				name: 'chatReadMessages',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagesRead'] } },
			},
			{
				displayName: 'Days (Latest)',
				name: 'chatReadDays',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagesRead'] } },
			},
			{
				displayName: 'Message ID',
				name: 'chatsMessageId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['chats'],
						operationChats: [
							'chatMessageGetById','chatMessageDelete','chatMessageEdit','chatMessagePin','chatMessageUnpin',
						],
					},
				},
			},
			{
				displayName: 'Download Media',
				name: 'chatMsgByIdDownload',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessageGetById'] } },
			},
			{
				displayName: 'Text',
				name: 'chatEditText',
				type: 'string',
				default: 'Hello, world!',
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessageEdit'] } },
			},
			{
				displayName: 'Link Preview',
				name: 'chatEditLinkPreview',
				type: 'boolean',
				default: true,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessageEdit'] } },
			},
			{
				displayName: 'Link Preview HQ',
				name: 'chatEditLinkPreviewHQ',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessageEdit'] } },
			},
			{
				displayName: 'Pin Duration (Seconds)',
				name: 'chatPinDuration',
				type: 'number',
				default: 86400,
				displayOptions: { show: { resource: ['chats'], operationChats: ['chatMessagePin'] } },
			},

			/* ---------- Status (24h) fields ---------- */
			{
				displayName: 'Text',
				name: 'statusText',
				type: 'string',
				default: 'Have a look! https://github.com/',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusText'] } },
			},
			{
				displayName: 'Background Color',
				name: 'statusBg',
				type: 'string',
				default: '#38b42f',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusText'] } },
			},
			{
				displayName: 'Font Index',
				name: 'statusFont',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusText'] } },
			},
			{
				displayName: 'Link Preview',
				name: 'statusLinkPreview',
				type: 'boolean',
				default: true,
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusText'] } },
			},
			{
				displayName: 'Link Preview HQ',
				name: 'statusLinkPreviewHQ',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusText'] } },
			},
			{
				displayName: 'Contacts (Optional)',
				name: 'statusContacts',
				type: 'string',
				default: '',
				description: 'Null or comma-separated list',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusText'] } },
			},
			{ displayName: 'Image URL', name: 'statusImgUrl', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusImage'] } } },
			{ displayName: 'Filename', name: 'statusImgName', type: 'string', required: true, default: 'image.jpg',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusImage'] } } },
			{ displayName: 'MIME Type', name: 'statusImgMime', type: 'string', required: true, default: 'image/jpeg',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusImage'] } } },
			{ displayName: 'Caption', name: 'statusImgCaption', type: 'string', default: '',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusImage'] } } },
			{ displayName: 'Voice URL', name: 'statusVoiceUrl', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVoice'] } } },
			{ displayName: 'Filename', name: 'statusVoiceName', type: 'string', required: true, default: 'note.ogg',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVoice'] } } },
			{ displayName: 'MIME Type', name: 'statusVoiceMime', type: 'string', required: true, default: 'audio/ogg; codecs=opus',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVoice'] } } },
			{ displayName: 'Convert', name: 'statusVoiceConvert', type: 'boolean', default: true,
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVoice'] } } },
			{ displayName: 'Caption', name: 'statusVoiceCaption', type: 'string', default: 'check this',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVoice'] } } },
			{ displayName: 'Video URL', name: 'statusVideoUrl', type: 'string', required: true, default: '',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVideo'] } } },
			{ displayName: 'Filename', name: 'statusVideoName', type: 'string', required: true, default: 'video.mp4',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVideo'] } } },
			{ displayName: 'MIME Type', name: 'statusVideoMime', type: 'string', required: true, default: 'video/mp4',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVideo'] } } },
			{ displayName: 'Caption', name: 'statusVideoCaption', type: 'string', default: 'Watch this clip',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVideo'] } } },
			{ displayName: 'Convert', name: 'statusVideoConvert', type: 'boolean', default: true,
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVideo'] } } },
			{ displayName: 'Send as Note', name: 'statusVideoAsNote', type: 'boolean', default: false,
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusVideo'] } } },
			{
				displayName: 'Status ID',
				name: 'statusDeleteId',
				type: 'string',
				required: true,
				default: 'status-msg-id',
				displayOptions: { show: { resource: ['status24h'], operationStatus: ['statusDelete'] } },
			},

			/* ---------- Contacts & LIDs fields ---------- */
			{
				displayName: 'Limit',
				name: 'contactsLimit',
				type: 'number',
				default: 50,
				displayOptions: { show: { resource: ['contacts'], operationContacts: ['contactsAll'] } },
			},
			{
				displayName: 'Offset',
				name: 'contactsOffset',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['contacts'], operationContacts: ['contactsAll'] } },
			},
			{
				displayName: 'Sort By',
				name: 'contactsSortBy',
				type: 'string',
				default: 'name',
				displayOptions: { show: { resource: ['contacts'], operationContacts: ['contactsAll'] } },
			},
			{
				displayName: 'Sort Order',
				name: 'contactsSortOrder',
				type: 'options',
				default: 'ASC',
				options: [
					{ name: 'ASC', value: 'ASC' },
					{ name: 'DESC', value: 'DESC' },
				],
				displayOptions: { show: { resource: ['contacts'], operationContacts: ['contactsAll'] } },
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				placeholder: '1234567890 or 1234567890@c.us',
				displayOptions: {
					show: {
						resource: ['contacts'],
						operationContacts: ['contactGet','contactAbout','contactProfilePicture','contactBlock','contactUnblock','contactUpsert'],
					},
				},
			},
			{
				displayName: 'Refresh (Bust Cache)',
				name: 'contactPicRefresh',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['contacts'], operationContacts: ['contactProfilePicture'] } },
			},
			{
				displayName: 'Phone (E.164 without +)',
				name: 'contactPhone',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['contacts'], operationContacts: ['contactCheckExists'] } },
			},
			{
				displayName: 'First Name',
				name: 'contactFirstName',
				type: 'string',
				default: 'John',
				displayOptions: { show: { resource: ['contacts'], operationContacts: ['contactUpsert'] } },
			},
			{
				displayName: 'Last Name',
				name: 'contactLastName',
				type: 'string',
				default: 'Doe',
				displayOptions: { show: { resource: ['contacts'], operationContacts: ['contactUpsert'] } },
			},
			{
				displayName: 'Limit',
				name: 'lidsLimit',
				type: 'number',
				default: 50,
				displayOptions: { show: { resource: ['lids'], operationLids: ['lidsList'] } },
			},
			{
				displayName: 'Offset',
				name: 'lidsOffset',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['lids'], operationLids: ['lidsList'] } },
			},

			/* ---------- Groups fields (extended) ---------- */

			// Common Group ID
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				placeholder: '123456789@g.us',
				displayOptions: {
					show: {
						resource: ['groups'],
						operationGroups: [
							'groupGet','groupDelete','groupLeave','groupPictureGet','groupPictureSet',
							'groupPictureDelete','groupDescriptionUpdate','groupSubjectUpdate',
							'groupInfoAdminOnlyGet','groupInfoAdminOnlySet','groupMessagesAdminOnlyGet',
							'groupMessagesAdminOnlySet','groupInviteCodeGet','groupInviteCodeRevoke',
							'groupParticipantsGet','groupParticipantsAdd','groupParticipantsRemove',
							'groupAdminPromote','groupAdminDemote',
						],
					},
				},
			},

			// List & Count & Refresh
			{
				displayName: 'Limit',
				name: 'groupsLimit',
				type: 'number',
				default: 50,
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupsList'] } },
			},
			{
				displayName: 'Sort Order',
				name: 'groupsSortOrder',
				type: 'options',
				default: 'DESC',
				options: [
					{ name: 'ASC', value: 'ASC' },
					{ name: 'DESC', value: 'DESC' },
				],
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupsList'] } },
			},

			// Create Group
			{
				displayName: 'Group Name',
				name: 'groupName',
				type: 'string',
				required: true,
				default: 'Project Alpha',
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupCreate'] } },
			},
			{
				displayName: 'Participants JSON',
				name: 'groupParticipantsJson',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: `[{ "id": "123456789" }, { "id": "987654321@c.us" }]`,
				description: 'Array of objects with "ID" (auto-normalized to @c.us if missing)',
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupCreate'] } },
			},

			// Join Info / Join
			{
				displayName: 'Invite Code or URL',
				name: 'groupJoinCode',
				type: 'string',
				required: true,
				default: 'https://chat.whatsapp.com/1234567890abcdef',
				displayOptions: {
					show: { resource: ['groups'], operationGroups: ['groupsJoinInfo','groupsJoin'] },
				},
			},

			// Picture
			{
				displayName: 'Refresh (Bust Cache)',
				name: 'groupPicRefresh',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupPictureGet'] } },
			},
			{
				displayName: 'Picture URL',
				name: 'groupPicUrl',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupPictureSet'] } },
			},
			{
				displayName: 'Picture Filename',
				name: 'groupPicName',
				type: 'string',
				required: true,
				default: 'team.jpg',
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupPictureSet'] } },
			},
			{
				displayName: 'Picture MIME Type',
				name: 'groupPicMime',
				type: 'string',
				required: true,
				default: 'image/jpeg',
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupPictureSet'] } },
			},

			// Description / Subject
			{
				displayName: 'Description',
				name: 'groupDescription',
				type: 'string',
				required: true,
				default: 'Sprint team',
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupDescriptionUpdate'] } },
			},
			{
				displayName: 'Subject',
				name: 'groupSubject',
				type: 'string',
				required: true,
				default: 'Project Alpha',
				displayOptions: { show: { resource: ['groups'], operationGroups: ['groupSubjectUpdate'] } },
			},

			// Admin-only toggles
			{
				displayName: 'Admins Only',
				name: 'groupAdminsOnly',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						resource: ['groups'],
						operationGroups: ['groupInfoAdminOnlySet','groupMessagesAdminOnlySet'],
					},
				},
			},

			// Participants batch JSON
			{
				displayName: 'Participants JSON',
				name: 'groupParticipantsBatchJson',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: `[{ "id": "111222333" }, { "id": "444555666@c.us" }]`,
				description: 'Array of { ID } objects. id auto-normalized to @c.us when missing.',
				displayOptions: {
					show: {
						resource: ['groups'],
						operationGroups: [
							'groupParticipantsAdd','groupParticipantsRemove','groupAdminPromote','groupAdminDemote',
						],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as
			| 'sessions'
			| 'auth'
			| 'sendMessages'
			| 'presence'
			| 'labels'
			| 'profile'
			| 'channels'
			| 'chats'
			| 'status24h'
			| 'contacts'
			| 'lids'
			| 'groups';

		for (let i = 0; i < items.length; i++) {
			let options: any;
			let responseData: any;

			/* =========================
			   SESSIONS
			========================= */
			if (resource === 'sessions') {
				const op = this.getNodeParameter('operationSessions', 0) as SessionsOp;

				if (op === 'createSession') {
					const creds = (await this.getCredentials('wawpNumberApi')) as { access_token: string };
					const sessionName = this.getNodeParameter('sessionName', i) as string;

					options = {
						method: 'POST',
						uri: 'https://wawp.net/wp-json/awp/v1/createSession',
						qs: { name: sessionName, access_token: creds.access_token },
						json: true,
					};
					responseData = await this.helpers.request.call(this, options);
				}

				if (op === 'startSession') {
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/session/start', qs: {}, json: true };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
				}

				if (op === 'stopSession') {
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/session/stop', qs: {}, json: true };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
				}

				if (op === 'restartSession') {
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/session/restart', qs: {}, json: true };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
				}

				if (op === 'deleteSession') {
					options = { method: 'DELETE', uri: 'https://wawp.net/wp-json/awp/v1/session/delete', qs: {}, json: true };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
				}

				if (op === 'logoutSession') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/session/logout', qs: {}, json: true };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
				}

				if (op === 'getSessionInfo') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/session/info', qs: {}, json: true };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
				}

				if (op === 'getSessionMe') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/session/me', qs: {}, json: true };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
				}
			}

			/* =========================
			   AUTH
			========================= */
			if (resource === 'auth') {
				const op = this.getNodeParameter('operationAuth', 0) as AuthOp;

				if (op === 'getQrRaw') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/getQr', qs: { format: 'raw' }, json: true };
				}
				if (op === 'getQrImage') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/getQr', qs: {}, json: true };
				}
				if (op === 'requestCode') {
					const phone_number = this.getNodeParameter('phoneNumber', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/requestCode', qs: { phone_number }, json: true };
				}
				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			/* =========================
			   SEND MESSAGES
			========================= */
			if (resource === 'sendMessages') {
				const op = this.getNodeParameter('operationSend', 0) as SendOp;

				if (op === 'sendText') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/send', qs: { chatId, message }, json: true };
				}

				if (op === 'sendImage') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const fileUrl = this.getNodeParameter('fileUrl', i) as string;
					const fileName = this.getNodeParameter('fileName', i) as string;
					const fileMime = this.getNodeParameter('fileMime', i) as string;
					const caption = this.getNodeParameter('caption', i, '') as string;
					options = {
						method: 'POST',
						uri: 'https://wawp.net/wp-json/awp/v1/sendImage',
						qs: { chatId, 'file[url]': fileUrl, 'file[filename]': fileName, 'file[mimetype]': fileMime, ...(caption ? { caption } : {}) },
						json: true,
					};
				}

				if (op === 'sendPdf') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const url = this.getNodeParameter('pdfUrl', i) as string;
					const name = this.getNodeParameter('pdfName', i) as string;
					const mime = this.getNodeParameter('pdfMime', i) as string;
					const caption = this.getNodeParameter('pdfCaption', i, '') as string;
					options = {
						method: 'POST',
						uri: 'https://wawp.net/wp-json/awp/v1/sendFile',
						qs: { chatId, 'file[url]': url, 'file[filename]': name, 'file[mimetype]': mime, ...(caption ? { caption } : {}) },
						json: true,
					};
				}

				if (op === 'sendVoice') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const url = this.getNodeParameter('voiceUrl', i) as string;
					const name = this.getNodeParameter('voiceName', i) as string;
					const mime = this.getNodeParameter('voiceMime', i) as string;
					const convert = this.getNodeParameter('voiceConvert', i) as boolean;
					options = {
						method: 'POST',
						uri: 'https://wawp.net/wp-json/awp/v1/sendVoice',
						qs: { chatId, convert: String(convert), 'file[url]': url, 'file[filename]': name, 'file[mimetype]': mime },
						json: true,
					};
				}

				if (op === 'sendVideo') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const url = this.getNodeParameter('videoUrl', i) as string;
					const name = this.getNodeParameter('videoName', i) as string;
					const mime = this.getNodeParameter('videoMime', i) as string;
					const caption = this.getNodeParameter('videoCaption', i, '') as string;
					const convert = this.getNodeParameter('videoConvert', i) as boolean;
					const asNote = this.getNodeParameter('videoAsNote', i) as boolean;
					options = {
						method: 'POST',
						uri: 'https://wawp.net/wp-json/awp/v1/sendVideo',
						qs: { chatId, convert: String(convert), asNote: String(asNote), 'file[url]': url, 'file[filename]': name, 'file[mimetype]': mime, ...(caption ? { caption } : {}) },
						json: true,
					};
				}

				if (op === 'sendLocation') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const latitude = this.getNodeParameter('latitude', i) as string;
					const longitude = this.getNodeParameter('longitude', i) as string;
					const title = this.getNodeParameter('locationTitle', i, '') as string;
					const message = this.getNodeParameter('locationMessage', i, '') as string;
					const replyTo = this.getNodeParameter('replyTo', i, '') as string;
					options = {
						method: 'POST',
						uri: 'https://wawp.net/wp-json/awp/v1/sendLocation',
						qs: { chatId, latitude, longitude, ...(title ? { title } : {}), ...(message ? { message } : {}), ...(replyTo ? { reply_to: replyTo } : {}) },
						json: true,
					};
				}

				if (op === 'sendPoll') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const pollName = this.getNodeParameter('pollName', i) as string;
					const pollOptionsCsv = this.getNodeParameter('pollOptions', i) as string;
					const multiple = this.getNodeParameter('pollMultiple', i) as boolean;
					const pollOptions = pollOptionsCsv.split(',').map((s) => s.trim()).filter(Boolean);
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/sendPoll', body: { chatId, poll: { name: pollName, options: pollOptions, multipleAnswers: multiple } }, json: true };
				}

				if (op === 'sendContactVcard') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const contactsJson = this.getNodeParameter('contactsJson', i) as string;
					let contacts: unknown;
					try { contacts = JSON.parse(contactsJson); } catch { throw new Error('Contacts (JSON) is not valid JSON.'); }
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/sendContactVcard', body: { chatId, contacts, reply_to: null }, json: true };
				}

				if (op === 'sendSeen') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const idsCsv = this.getNodeParameter('seenMessageIds', i) as string;
					const participant = this.getNodeParameter('seenParticipant', i, '') as string;
					const messageIds = idsCsv.split(',').map((s) => s.trim()).filter(Boolean);
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/sendSeen', qs: { chatId: [chatId], 'messageIds[]': messageIds, ...(participant ? { participant: [participant] } : {}) }, json: true };
				}

				if (op === 'startTyping') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/startTyping', qs: { chatId }, json: true };
				}

				if (op === 'stopTyping') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/stopTyping', qs: { chatId }, json: true };
				}

				if (op === 'reaction') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const messageId = this.getNodeParameter('reactionMessageId', i) as string;
					const reaction = this.getNodeParameter('reaction', i) as string;
					options = { method: 'PUT', uri: 'https://wawp.net/wp-json/awp/v1/reaction', qs: { chatId, messageId, reaction }, json: true };
				}

				if (op === 'star') {
					const chatId = this.getNodeParameter('chatId', i) as string;
					const messageId = this.getNodeParameter('starMessageId', i) as string;
					const star = this.getNodeParameter('starFlag', i) as boolean;
					options = { method: 'PUT', uri: 'https://wawp.net/wp-json/awp/v1/star', qs: { chatId, messageId, star: String(star) }, json: true };
				}

				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			/* =========================
			   PRESENCE
			========================= */
			if (resource === 'presence') {
				const op = this.getNodeParameter('operationPresence', 0) as PresenceOp;

				if (op === 'presenceSet') {
					const presence = this.getNodeParameter('presenceValue', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/presence', qs: { presence }, json: true };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
				}

				if (op === 'presenceGetByChatId') {
					const chatId = this.getNodeParameter('presenceChatId', i) as string;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/presence/${encodeURIComponent(chatId)}`, qs: {}, json: true };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
				}
			}

			/* =========================
			   LABELS
			========================= */
			if (resource === 'labels') {
				const op = this.getNodeParameter('operationLabels', 0) as LabelsOp;

				if (op === 'labelsList') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/labels', qs: {}, json: true };
				}

				if (op === 'labelCreate') {
					const name = this.getNodeParameter('labelName', i) as string;
					const colorHex = this.getNodeParameter('labelColorHex', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/labels', body: { name, colorHex, color: null }, json: true };
				}

				if (op === 'labelUpdate') {
					const labelId = this.getNodeParameter('labelId', i) as string;
					const name = this.getNodeParameter('labelName', i) as string;
					const colorHex = this.getNodeParameter('labelColorHex', i) as string;
					options = { method: 'PUT', uri: `https://wawp.net/wp-json/awp/v1/labels/${encodeURIComponent(labelId)}`, body: { name, colorHex, color: null }, json: true };
				}

				if (op === 'labelDelete') {
					const labelId = this.getNodeParameter('labelId', i) as string;
					options = { method: 'DELETE', uri: `https://wawp.net/wp-json/awp/v1/labels/${encodeURIComponent(labelId)}`, qs: {}, json: true };
				}

				if (op === 'labelsForChatGet') {
					const chatId = this.getNodeParameter('labelsChatId', i) as string;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/labels/chats/${encodeURIComponent(chatId)}`, qs: {}, json: true };
				}

				if (op === 'labelsForChatSave') {
					const chatId = this.getNodeParameter('labelsChatId', i) as string;
					const labelsJson = this.getNodeParameter('labelsJson', i) as string;
					let bodyParsed: unknown;
					try { bodyParsed = JSON.parse(labelsJson); } catch { throw new Error('Labels JSON is not valid JSON.'); }
					options = { method: 'PUT', uri: `https://wawp.net/wp-json/awp/v1/labels/chats/${encodeURIComponent(chatId)}`, body: bodyParsed, json: true };
				}

				if (op === 'chatsWithLabel') {
					const labelId = this.getNodeParameter('labelId', i) as string;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/labels/${encodeURIComponent(labelId)}/chats`, qs: {}, json: true };
				}

				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			/* =========================
			   PROFILE
			========================= */
			if (resource === 'profile') {
				const op = this.getNodeParameter('operationProfile', 0) as ProfileOp;

				if (op === 'profileGet') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/profile', qs: {}, json: true };
				}

				if (op === 'profileSetName') {
					const name = this.getNodeParameter('profileDisplayName', i) as string;
					options = { method: 'PUT', uri: 'https://wawp.net/wp-json/awp/v1/profile/nameRequest', qs: { name }, json: true };
				}

				if (op === 'profileSetStatus') {
					const status = this.getNodeParameter('profileStatus', i) as string;
					options = { method: 'PUT', uri: 'https://wawp.net/wp-json/awp/v1/profile/status', qs: { status }, json: true };
				}

				if (op === 'profileUploadPicture') {
					const url = this.getNodeParameter('profilePicUrl', i) as string;
					const filename = this.getNodeParameter('profilePicName', i) as string;
					const mimetype = this.getNodeParameter('profilePicMime', i) as string;
					options = {
						method: 'PUT',
						uri: 'https://wawp.net/wp-json/awp/v1/profile/picture',
						qs: { 'file[url]': url, 'file[filename]': filename, 'file[mimetype]': mimetype },
						json: true,
					};
				}

				if (op === 'profileDeletePicture') {
					options = { method: 'DELETE', uri: 'https://wawp.net/wp-json/awp/v1/profile/picture', qs: {}, json: true };
				}

				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			/* =========================
			   CHANNELS
			========================= */
			if (resource === 'channels') {
				const op = this.getNodeParameter('operationChannels', 0) as ChannelsOp;

				if (op === 'channelsList') {
					const role = this.getNodeParameter('channelsRole', i) as string;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/channels', qs: { ...(role ? { role } : {}) }, json: true };
				}

				if (op === 'channelsCreate') {
					const name = this.getNodeParameter('channelCreateName', i) as string;
					const description = this.getNodeParameter('channelCreateDesc', i) as string;
					const url = this.getNodeParameter('channelPicUrl', i) as string;
					const filename = this.getNodeParameter('channelPicName', i) as string;
					const mimetype = this.getNodeParameter('channelPicMime', i) as string;
					const type = this.getNodeParameter('channelType', i) as string;

					options = {
						method: 'POST',
						uri: 'https://wawp.net/wp-json/awp/v1/channels',
						body: {
							name,
							description,
							picture: { mimetype, filename, url },
							type,
						},
						json: true,
					};
				}

				if (op === 'channelsGet') {
					const id = this.getNodeParameter('channelId', i) as string;
					const name = this.getNodeParameter('channelsName', i) as string;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/channels/${encodeURIComponent(id)}`, qs: { ...(name ? { name } : {}) }, json: true };
				}

				if (op === 'channelsDelete') {
					const id = this.getNodeParameter('channelId', i) as string;
					options = { method: 'DELETE', uri: `https://wawp.net/wp-json/awp/v1/channels/${encodeURIComponent(id)}`, qs: {}, json: true };
				}

				if (op === 'channelsPreviewMessages') {
					const id = this.getNodeParameter('channelId', i) as string;
					const downloadMedia = this.getNodeParameter('channelsPreviewDownload', i) as boolean;
					const limit = this.getNodeParameter('channelsPreviewLimit', i) as number;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/channels/${encodeURIComponent(id)}/messages/preview`, qs: { downloadMedia, limit }, json: true };
				}

				if (op === 'channelsFollow') {
					const id = this.getNodeParameter('channelId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/channels/${encodeURIComponent(id)}/follow`, qs: {}, json: true };
				}

				if (op === 'channelsUnfollow') {
					const id = this.getNodeParameter('channelId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/channels/${encodeURIComponent(id)}/unfollow`, qs: {}, json: true };
				}

				if (op === 'channelsMute') {
					const id = this.getNodeParameter('channelId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/channels/${encodeURIComponent(id)}/mute`, qs: {}, json: true };
				}

				if (op === 'channelsUnmute') {
					const id = this.getNodeParameter('channelId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/channels/${encodeURIComponent(id)}/unmute`, qs: {}, json: true };
				}

				// Searches
				if (op === 'channelsSearchByView' || op === 'channelsSearchByText') {
					const countriesCsv = this.getNodeParameter('channelsCountries', i) as string;
					const categoriesCsv = this.getNodeParameter('channelsCategories', i) as string;
					const limit = this.getNodeParameter('channelsSearchLimit', i) as number;
					const startCursor = this.getNodeParameter('channelsStartCursor', i) as string;

					const qs: Record<string, any> = { limit, ...(startCursor ? { startCursor } : {}) };
					if (op === 'channelsSearchByView') {
						const view = this.getNodeParameter('channelsView', i) as string;
						qs.view = view;
					} else {
						const text = this.getNodeParameter('channelsSearchText', i) as string;
						qs.text = text;
					}
					const countries = (countriesCsv || '').split(',').map(s => s.trim()).filter(Boolean);
					const categories = (categoriesCsv || '').split(',').map(s => s.trim()).filter(Boolean);
					if (countries.length) qs['countries'] = countries;
					if (categories.length) qs['categories'] = categories;

					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/channels/search', qs, json: true };
				}

				if (op === 'channelsSearchViews') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/channels/search/views', qs: {}, json: true };
				}
				if (op === 'channelsSearchCountries') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/channels/search/countries', qs: {}, json: true };
				}
				if (op === 'channelsSearchCategories') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/channels/search/categories', qs: {}, json: true };
				}

				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			/* =========================
			   CHATS
			========================= */
			if (resource === 'chats') {
				const op = this.getNodeParameter('operationChats', 0) as ChatsOp;

				if (op === 'chatsList') {
					const sortBy = this.getNodeParameter('chatsSortBy', i) as string;
					const sortOrder = this.getNodeParameter('chatsSortOrder', i) as string;
					const limit = this.getNodeParameter('chatsLimit', i) as number;
					const offset = this.getNodeParameter('chatsOffset', i) as number;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/chats', qs: { sortBy, sortOrder, limit, offset }, json: true };
				}

				if (op === 'chatsOverview') {
					const limit = this.getNodeParameter('chatsLimit', i) as number;
					const offset = this.getNodeParameter('chatsOffset', i) as number;
					const idsCsv = this.getNodeParameter('chatsOverviewIds', i) as string;
					const ids = (idsCsv || '').split(',').map(s => s.trim()).filter(Boolean);
					const qs: any = { limit, offset };
					if (ids.length) qs['ids'] = ids;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/chats/overview', qs, json: true };
				}

				if (op === 'chatDelete') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					options = { method: 'DELETE', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}`, qs: {}, json: true };
				}

				if (op === 'chatPicture') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					const refresh = this.getNodeParameter('chatPictureRefresh', i) as boolean;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/picture`, qs: { refresh }, json: true };
				}

				if (op === 'chatMessagesGet') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					const downloadMedia = this.getNodeParameter('chatMsgDownload', i) as boolean;
					const limit = this.getNodeParameter('chatMsgLimit', i) as number;
					const offset = this.getNodeParameter('chatMsgOffset', i) as number;
					const tsLte = this.getNodeParameter('chatMsgTsLte', i) as number;
					const tsGte = this.getNodeParameter('chatMsgTsGte', i) as number;
					const fromMe = this.getNodeParameter('chatMsgFromMe', i) as boolean;
					const ack = this.getNodeParameter('chatMsgAck', i) as string;

					const qs: Record<string, any> = { downloadMedia, limit, offset };
					if (tsLte) qs['filter.timestamp.lte'] = tsLte;
					if (tsGte) qs['filter.timestamp.gte'] = tsGte;
					if (fromMe) qs['filter.fromMe'] = true;
					if (ack) qs['filter.ack'] = ack;

					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/messages`, qs, json: true };
				}

				if (op === 'chatMessagesClear') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					options = { method: 'DELETE', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/messages`, qs: {}, json: true };
				}

				if (op === 'chatMessagesRead') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					const messages = this.getNodeParameter('chatReadMessages', i) as number;
					const days = this.getNodeParameter('chatReadDays', i) as number;
					const qs: any = {};
					if (messages) qs.messages = messages;
					if (days) qs.days = days;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/messages/read`, qs, json: true };
				}

				if (op === 'chatMessageGetById') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					const messageId = this.getNodeParameter('chatsMessageId', i) as string;
					const downloadMedia = this.getNodeParameter('chatMsgByIdDownload', i) as boolean;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`, qs: { downloadMedia }, json: true };
				}

				if (op === 'chatMessageDelete') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					const messageId = this.getNodeParameter('chatsMessageId', i) as string;
					options = { method: 'DELETE', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`, qs: {}, json: true };
				}

				if (op === 'chatMessageEdit') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					const messageId = this.getNodeParameter('chatsMessageId', i) as string;
					const text = this.getNodeParameter('chatEditText', i) as string;
					const linkPreview = this.getNodeParameter('chatEditLinkPreview', i) as boolean;
					const linkPreviewHighQuality = this.getNodeParameter('chatEditLinkPreviewHQ', i) as boolean;
					options = { method: 'PUT', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`, qs: { text, linkPreview: String(linkPreview), linkPreviewHighQuality: String(linkPreviewHighQuality) }, json: true };
				}

				if (op === 'chatMessagePin') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					const messageId = this.getNodeParameter('chatsMessageId', i) as string;
					const duration = this.getNodeParameter('chatPinDuration', i) as number;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/pin`, qs: { duration }, json: true };
				}

				if (op === 'chatMessageUnpin') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					const messageId = this.getNodeParameter('chatsMessageId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/unpin`, qs: {}, json: true };
				}

				if (op === 'chatArchive') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/archive`, qs: {}, json: true };
				}

				if (op === 'chatUnarchive') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/unarchive`, qs: {}, json: true };
				}

				if (op === 'chatMarkUnread') {
					const chatId = this.getNodeParameter('chatsChatId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/chats/${encodeURIComponent(chatId)}/unread`, qs: {}, json: true };
				}

				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			/* =========================
			   STATUS (24h)
			========================= */
			if (resource === 'status24h') {
				const op = this.getNodeParameter('operationStatus', 0) as StatusOp;

				if (op === 'statusText') {
					const text = this.getNodeParameter('statusText', i) as string;
					const backgroundColor = this.getNodeParameter('statusBg', i) as string;
					const font = this.getNodeParameter('statusFont', i) as number;
					const linkPreview = this.getNodeParameter('statusLinkPreview', i) as boolean;
					const linkPreviewHighQuality = this.getNodeParameter('statusLinkPreviewHQ', i) as boolean;
					const contacts = this.getNodeParameter('statusContacts', i) as string;

					const qs: any = { text, backgroundColor, font, linkPreview, linkPreviewHighQuality };
					if (contacts) qs.contacts = contacts;

					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/status/text', qs, json: true };
				}

				if (op === 'statusImage') {
					const url = this.getNodeParameter('statusImgUrl', i) as string;
					const filename = this.getNodeParameter('statusImgName', i) as string;
					const mimetype = this.getNodeParameter('statusImgMime', i) as string;
					const caption = this.getNodeParameter('statusImgCaption', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/status/image', qs: { 'file[url]': url, 'file[filename]': filename, 'file[mimetype]': mimetype, ...(caption ? { caption } : {}) }, json: true };
				}

				if (op === 'statusVoice') {
					const url = this.getNodeParameter('statusVoiceUrl', i) as string;
					const filename = this.getNodeParameter('statusVoiceName', i) as string;
					const mimetype = this.getNodeParameter('statusVoiceMime', i) as string;
					const convert = this.getNodeParameter('statusVoiceConvert', i) as boolean;
					const caption = this.getNodeParameter('statusVoiceCaption', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/status/voice', qs: { convert: String(convert), 'file[url]': url, 'file[filename]': filename, 'file[mimetype]': mimetype, ...(caption ? { caption } : {}) }, json: true };
				}

				if (op === 'statusVideo') {
					const url = this.getNodeParameter('statusVideoUrl', i) as string;
					const filename = this.getNodeParameter('statusVideoName', i) as string;
					const mimetype = this.getNodeParameter('statusVideoMime', i) as string;
					const caption = this.getNodeParameter('statusVideoCaption', i) as string;
					const convert = this.getNodeParameter('statusVideoConvert', i) as boolean;
					const asNote = this.getNodeParameter('statusVideoAsNote', i) as boolean;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/status/video', qs: { convert: String(convert), asNote: String(asNote), 'file[url]': url, 'file[filename]': filename, 'file[mimetype]': mimetype, ...(caption ? { caption } : {}) }, json: true };
				}

				if (op === 'statusDelete') {
					const id = this.getNodeParameter('statusDeleteId', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/status/delete', qs: { id }, json: true };
				}

				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			/* =========================
			   CONTACTS
			========================= */
			if (resource === 'contacts') {
				const op = this.getNodeParameter('operationContacts', 0) as ContactsOp;

				if (op === 'contactsAll') {
					const limit = this.getNodeParameter('contactsLimit', i) as number;
					const offset = this.getNodeParameter('contactsOffset', i) as number;
					const sortBy = this.getNodeParameter('contactsSortBy', i) as string;
					const sortOrder = this.getNodeParameter('contactsSortOrder', i) as string;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/contacts/all', qs: { limit, offset, sortBy, sortOrder }, json: true };
				}

				if (op === 'contactGet') {
					const contactId = this.getNodeParameter('contactId', i) as string;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/contacts', qs: { contactId }, json: true };
				}

				if (op === 'contactCheckExists') {
					const phone = this.getNodeParameter('contactPhone', i) as string;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/contacts/check-exists', qs: { phone }, json: true };
				}

				if (op === 'contactAbout') {
					const contactId = this.getNodeParameter('contactId', i) as string;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/contacts/about', qs: { contactId }, json: true };
				}

				if (op === 'contactProfilePicture') {
					const contactId = this.getNodeParameter('contactId', i) as string;
					const refresh = this.getNodeParameter('contactPicRefresh', i) as boolean;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/contacts/profile-picture', qs: { contactId, refresh }, json: true };
				}

				if (op === 'contactBlock') {
					const contactId = this.getNodeParameter('contactId', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/contacts/block', qs: { contactId }, json: true };
				}

				if (op === 'contactUnblock') {
					const contactId = this.getNodeParameter('contactId', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/contacts/unblock', qs: { contactId }, json: true };
				}

				if (op === 'contactUpsert') {
					const contactId = this.getNodeParameter('contactId', i) as string;
					const firstName = this.getNodeParameter('contactFirstName', i) as string;
					const lastName = this.getNodeParameter('contactLastName', i) as string;
					options = { method: 'PUT', uri: `https://wawp.net/wp-json/awp/v1/contacts/${encodeURIComponent(contactId)}`, qs: { firstName, lastName }, json: true };
				}

				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			/* =========================
			   LIDs
			========================= */
			if (resource === 'lids') {
				const op = this.getNodeParameter('operationLids', 0) as LidsOp;

				if (op === 'lidsList') {
					const limit = this.getNodeParameter('lidsLimit', i) as number;
					const offset = this.getNodeParameter('lidsOffset', i) as number;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/lids', qs: { limit, offset }, json: true };
				}

				if (op === 'lidsCount') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/lids/count', qs: {}, json: true };
				}

				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			/* =========================
			   GROUPS (extended)
			========================= */
			if (resource === 'groups') {
				const op = this.getNodeParameter('operationGroups', 0) as GroupsOp;

				// list
				if (op === 'groupsList') {
					const limit = this.getNodeParameter('groupsLimit', i) as number;
					const sortOrder = this.getNodeParameter('groupsSortOrder', i) as string;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/groups', qs: { limit, sortOrder }, json: true };
				}

				// create
				if (op === 'groupCreate') {
					const name = this.getNodeParameter('groupName', i) as string;
					const participantsJson = this.getNodeParameter('groupParticipantsJson', i) as string;
					let participants: unknown;
					try { participants = JSON.parse(participantsJson); } catch { throw new Error('Participants JSON is not valid JSON.'); }
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/groups', body: { name, participants }, json: true };
				}

				// join info
				if (op === 'groupsJoinInfo') {
					const code = this.getNodeParameter('groupJoinCode', i) as string;
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/groups/join-info', qs: { code }, json: true };
				}

				// join
				if (op === 'groupsJoin') {
					const code = this.getNodeParameter('groupJoinCode', i) as string;
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/groups/join', body: { code }, json: true };
				}

				// count
				if (op === 'groupsCount') {
					options = { method: 'GET', uri: 'https://wawp.net/wp-json/awp/v1/groups/count', qs: {}, json: true };
				}

				// refresh
				if (op === 'groupsRefresh') {
					options = { method: 'POST', uri: 'https://wawp.net/wp-json/awp/v1/groups/refresh', qs: {}, json: true };
				}

				// get/delete/leave
				if (op === 'groupGet') {
					const id = this.getNodeParameter('groupId', i) as string;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}`, qs: {}, json: true };
				}
				if (op === 'groupDelete') {
					const id = this.getNodeParameter('groupId', i) as string;
					options = { method: 'DELETE', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}`, qs: {}, json: true };
				}
				if (op === 'groupLeave') {
					const id = this.getNodeParameter('groupId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/leave`, qs: {}, json: true };
				}

				// picture get/set/delete
				if (op === 'groupPictureGet') {
					const id = this.getNodeParameter('groupId', i) as string;
					const refresh = this.getNodeParameter('groupPicRefresh', i) as boolean;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/picture`, qs: { refresh }, json: true };
				}
				if (op === 'groupPictureSet') {
					const id = this.getNodeParameter('groupId', i) as string;
					const url = this.getNodeParameter('groupPicUrl', i) as string;
					const filename = this.getNodeParameter('groupPicName', i) as string;
					const mimetype = this.getNodeParameter('groupPicMime', i) as string;
					options = { method: 'PUT', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/picture`, body: { file: { mimetype, filename, url } }, json: true };
				}
				if (op === 'groupPictureDelete') {
					const id = this.getNodeParameter('groupId', i) as string;
					options = { method: 'DELETE', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/picture`, qs: {}, json: true };
				}

				// description / subject
				if (op === 'groupDescriptionUpdate') {
					const id = this.getNodeParameter('groupId', i) as string;
					const description = this.getNodeParameter('groupDescription', i) as string;
					options = { method: 'PUT', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/description`, body: { description }, json: true };
				}
				if (op === 'groupSubjectUpdate') {
					const id = this.getNodeParameter('groupId', i) as string;
					const subject = this.getNodeParameter('groupSubject', i) as string;
					options = { method: 'PUT', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/subject`, body: { subject }, json: true };
				}

				// security settings
				if (op === 'groupInfoAdminOnlyGet') {
					const id = this.getNodeParameter('groupId', i) as string;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/settings/security/info-admin-only`, qs: {}, json: true };
				}
				if (op === 'groupInfoAdminOnlySet') {
					const id = this.getNodeParameter('groupId', i) as string;
					const adminsOnly = this.getNodeParameter('groupAdminsOnly', i) as boolean;
					options = { method: 'PUT', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/settings/security/info-admin-only`, qs: { adminsOnly }, json: true };
				}
				if (op === 'groupMessagesAdminOnlyGet') {
					const id = this.getNodeParameter('groupId', i) as string;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/settings/security/messages-admin-only`, qs: {}, json: true };
				}
				if (op === 'groupMessagesAdminOnlySet') {
					const id = this.getNodeParameter('groupId', i) as string;
					const adminsOnly = this.getNodeParameter('groupAdminsOnly', i) as boolean;
					options = { method: 'PUT', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/settings/security/messages-admin-only`, qs: { adminsOnly }, json: true };
				}

				// invite code
				if (op === 'groupInviteCodeGet') {
					const id = this.getNodeParameter('groupId', i) as string;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/invite-code`, qs: {}, json: true };
				}
				if (op === 'groupInviteCodeRevoke') {
					const id = this.getNodeParameter('groupId', i) as string;
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/invite-code/revoke`, qs: {}, json: true };
				}

				// participants
				if (op === 'groupParticipantsGet') {
					const id = this.getNodeParameter('groupId', i) as string;
					options = { method: 'GET', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/participants`, qs: {}, json: true };
				}
				if (op === 'groupParticipantsAdd') {
					const id = this.getNodeParameter('groupId', i) as string;
					const participantsJson = this.getNodeParameter('groupParticipantsBatchJson', i) as string;
					let participants: unknown;
					try { participants = JSON.parse(participantsJson); } catch { throw new Error('Participants JSON is not valid JSON.'); }
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/participants/add`, body: { participants }, json: true };
				}
				if (op === 'groupParticipantsRemove') {
					const id = this.getNodeParameter('groupId', i) as string;
					const participantsJson = this.getNodeParameter('groupParticipantsBatchJson', i) as string;
					let participants: unknown;
					try { participants = JSON.parse(participantsJson); } catch { throw new Error('Participants JSON is not valid JSON.'); }
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/participants/remove`, body: { participants }, json: true };
				}

				// admin promote/demote
				if (op === 'groupAdminPromote') {
					const id = this.getNodeParameter('groupId', i) as string;
					const participantsJson = this.getNodeParameter('groupParticipantsBatchJson', i) as string;
					let participants: unknown;
					try { participants = JSON.parse(participantsJson); } catch { throw new Error('Participants JSON is not valid JSON.'); }
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/admin/promote`, body: { participants }, json: true };
				}
				if (op === 'groupAdminDemote') {
					const id = this.getNodeParameter('groupId', i) as string;
					const participantsJson = this.getNodeParameter('groupParticipantsBatchJson', i) as string;
					let participants: unknown;
					try { participants = JSON.parse(participantsJson); } catch { throw new Error('Participants JSON is not valid JSON.'); }
					options = { method: 'POST', uri: `https://wawp.net/wp-json/awp/v1/groups/${encodeURIComponent(id)}/admin/demote`, body: { participants }, json: true };
				}

				responseData = await this.helpers.requestWithAuthentication.call(this, 'wawpNumberApi', options);
			}

			if (responseData !== undefined) {
				returnData.push({ json: responseData });
			}
		}

		return this.prepareOutputData(returnData);
	}
}
