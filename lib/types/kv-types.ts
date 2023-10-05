export interface PageUser {
  uid: string;
  username: string;
  photoURL: string;
}
export interface Friend {
  uid: string;
  username: string;
  photoURL: string;
  since: number;
}

export interface FriendRequest {
  uid: string;
  username: string;
  since: number;
  isRequest: boolean;
}

export interface FriendReturnObject {
  since: number;
  photoURL: string;
  old: boolean;
  isRequest: boolean;
}

export interface FriendRequestReturnObject {
  since: number;
  isRequest: boolean;
  uid: string;
}
