import { Schema, type } from '@colyseus/schema'

export type TPlayerOptions = Pick<Player, 'sessionId' | 'userId' | 'name' | 'avatarUri' | 'talking' | 'isOwner'>

export class Player extends Schema {
	@type('string')
	public sessionId: string

	@type('string')
	public userId: string

	@type('string')
	public avatarUri: string

	@type('string')
	public name: string

	@type('boolean')
	public talking: boolean = false

	@type('boolean')
	public isOwner: boolean = false

	constructor({ name, userId, avatarUri, sessionId }: TPlayerOptions) {
		super()
		this.userId = userId
		this.avatarUri = avatarUri
		this.name = name
		this.sessionId = sessionId
	}
}
