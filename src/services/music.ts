import { get } from ".";

export function getRandomMusicService(sort: string = '', format: string = 'json') {
    return get<{ name: string, url: string, picurl: string, artistsname: string }>(`/api/rand.music`, { sort, format })
}