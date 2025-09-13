// WawpNumberApi.credentials.ts
import type {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
  } from 'n8n-workflow';
  
  export class WawpNumberApi implements ICredentialType {
	name = 'wawpNumberApi';
	displayName = 'Wawp Number API';
	documentationUrl = 'wawpNumber';
  
	properties: INodeProperties[] = [
	  {
		displayName: 'Instance ID',
		name: 'instance_id',
		type: 'string',
		default: '',
		required: true,
	  },
	  {
		displayName: 'Access Token',
		name: 'access_token',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
	  },
	];
  
	authenticate = {
	  type: 'generic' as const,
	  properties: {
		qs: {
		  instance_id: '={{$credentials.instance_id}}',
		  access_token: '={{$credentials.access_token}}',
		},
	  },
	};
  
	test: ICredentialTestRequest = {
	  request: {
		baseURL: 'https://wawp.net',
		url: '/wp-json/awp/v1/session/info',
	  },
	};
  }
  