import { Schema, MapSchema, type } from '@colyseus/schema'
import { TPlayerOptions, Player } from './Player.js'

export interface IState {
	roomName: string
	channelId: string
}

export class State extends Schema {
	@type({ map: Player })
	players = new MapSchema<Player>()

	@type('string')
	public roomName: string

	@type('string')
	public channelId: string

	@type('string')
	public ownerId: string

	serverAttribute = 'this attribute wont be sent to the client-side'

	constructor(attributes: IState) {
		super()
		this.roomName = attributes.roomName
		this.channelId = attributes.channelId
		this.ownerId = ''
	}

	private _getPlayer(sessionId: string): Player | undefined {
		return Array.from(this.players.values()).find((p) => p.sessionId === sessionId)
	}

	createPlayer(sessionId: string, playerOptions: TPlayerOptions) {
		const existingPlayer = Array.from(this.players.values()).find((p) => p.sessionId === sessionId)
		if (existingPlayer == null) {
			this.players.set(playerOptions.userId, new Player({ ...playerOptions, sessionId }))
		}
	}

	removePlayer(sessionId: string) {
		const player = Array.from(this.players.values()).find((p) => p.sessionId === sessionId)
		if (player != null) {
			this.players.delete(player.userId)
		}
	}

	startTalking(sessionId: string) {
		const player = this._getPlayer(sessionId)
		if (player != null) {
			player.talking = true
		}
	}

	stopTalking(sessionId: string) {
		const player = this._getPlayer(sessionId)
		if (player != null) {
			player.talking = false
		}
	}

	setOwner(userId: string) {
		const oldOwner = this.players.get(this.ownerId)
		if (oldOwner != null) {
			oldOwner.isOwner = false
		}
		const newOwner = this.players.get(userId)
		if (newOwner != null) {
			newOwner.isOwner = true
			this.ownerId = userId
		}
	}
}
