import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class PugApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${PugApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /****************************************************************************** Auth API Routes */

  /** Logs in user */

  static async login(data){
      let res = await this.request(`auth/token`, data, "post");
      return res.token
  }

  static async signup(data){
      let res = await this.request(`auth/register`, data, "post")
      return res.token
  }
  
  /****************************************************************************** User API Routes */

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res;
  }

  /** Edit current user profile.
   *    Data can include:
   *    - { username, firstName, lastName, birthDate, city, phoneNumber, profileImg, email, isPrivate }
   */

  static async editUserProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  /** Get Users (pass filter queries as data).
   *    Data can include
   *      - username
   *      - firstName
   *      - lastName
   *      - city
   *      - state
   *      - isActive
   *
   */

  static async getUsers(data) {
    let res = await this.request(`users`, data);
    return res.users;
  }

  /** Change user password.
   *    Date required:
   *       - oldPassword
   *       - newPassword
   */

  static async changePassword(username) {
    let res = await this.request(`users/${username}/password`, {}, "patch");
    return res.user;
  }

  /** Deactivate user. */

  static async deactivateUser(username) {
    let res = await this.request(`users/${username}/deactivate`, {}, "patch");
    return res;
  }

  /** Reactivate user. */

  static async reactivateUser(username) {
    let res = await this.request(`users/${username}/reactivate`, {}, "patch");
    return res;
  }

  /** Get follower/following data on user. */

  static async getRelationships(username) {
    let res = await this.request(`users/${username}/follow`);
    return res;
  }

  /** toggle following status for user. */

  static async toggleRelationship(username, followed) {
    let res = await this.request(
      `users/${username}/follow/${followed}`,
      {},
      "post"
    );
    return res;
  }

  /** get currUser threads. */

  static async getThreads(username) {
    let res = await this.request(`users/${username}/threads`);
    return res.threads;
  }

  /** get currUser messages in thread. */

  static async getMessages(username, threadId) {
    let res = await this.request(`users/${username}/threads/${threadId}`);
    return res.messages;
  }

  /** create a message outside responding in thread.
   *    Date required:
   *        - message
   *        = party
   */

  static async createMessage(username, data) {
    let res = await this.request(`users/${username}/threads`, data, "post");
    return res.message;
  }

  /** respond with a message in thread.
   *    Date required:
   *        = message
   */

  static async respondThread(username, threadId, data) {
    let res = await this.request(
      `users/${username}/threads/${threadId}`,
      data,
      "post"
    );
    return res.message;
  }

  /** deletes thread for user */

  static async deleteThread(username, threadId) {
    let res = await this.request(
      `users/${username}/threads/${threadId}`,
      {},
      "delete"
    );
    return res;
  }

  /** deletes message for user */

  static async deleteMessage(username, messageId) {
    let res = await this.request(
      `users/${username}/messages/${messageId}`,
      {},
      "delete"
    );
    return res;
  }

  /** get invites for user */

  static async getInvites(username) {
    let res = await this.request(`users/${username}/invites`);
    return res.invites;
  }

  /** creates group/individual invites for a game.
   *    Data required:
   *        - toUsers { array }
   */

  static async createInvites(username, gameId, data) {
    let res = await this.request(
      `users/${username}/invites/add/${gameId}`,
      data,
      "post"
    );
    return res.invites;
  }

  /** updates invite status for user.
   *    status can only be: 
   *        - 'cancel' - from users invites sent
   *        - 'accept' = from users invites received 
   *        - 'deny' = from users invites received
   * 
`` */

  static async updateInvite(username, status, inviteId) {
    let res = await this.request(
      `users/${username}/invites/${status}/${inviteId}`,
      {},
      "patch"
    );
    return res;
  }

  /********************************************************************************* Game API routes */

  /** get games (pass search filters as data).
   *    Data can include:
   *         - date
   *         - city
   *         - state
   *         - host
   *         - joined
   *         - isActive
   *         - gameStatus 'pending' || 'resolved'
   */

  static async getGames(data = {isActive: true}) {
    let res = await this.request(`games`, data);
    return res.games
  }

  /** gets game.  */

  static async getGame(gameId) {
    let res = await this.request(`games/${gameId}`);
    return res;
  }

  static async getInactiveGames(username){
    const data = {
      host: username, 
      isActive: false
    }
    let res = await this.request(`games`, data)
    return res.games
  }

  /** creates a game. 
   *    Data required: 
   *        - title
   *        = description
   *        = date 
   *        = time 
   *        = address 
   *        = city 
   *        - state
  */
  static async createGame(data){
      let res = await this.request(`games`, data, 'post')
      return res.details

  }

  /** updates a game. 
   *    Data can include: 
   *        - titile 
   *        = description
   *        = date 
   *        = time 
   *        = address 
   *        = city 
   *        - state
  */
  static async updateGame(gameId, data){
      let res = await this.request(`games/${gameId}`, data, 'patch')
      return res.details
  }

  /** creates a game comment. 
   *    Data required: 
   *        - comment
  */
  static async addComment(gameId, username, data){
      let res = await this.request(`games/${gameId}/comment/${username}`, data, 'post')
      return res.comment
  }

  /** deletes a game comment. 
   *   
  */
  static async deleteComment(gameId, commentId){
      let res = await this.request(`games/${gameId}/comment/${commentId}`, {}, 'delete')
      return res
  }

  /** joins a game.  */

  static async joinGame(gameId, username){
      let res = await this.request(`games/${gameId}/join/${username}`, {}, 'post')
      return res.players
  }

  /** leave game.  */

  static async leaveGame(gameId, username){
      let res = await this.request(`games/${gameId}/join/${username}`, {}, 'delete')
      return res.players
  }

  /** deactivate game.  */

  static async deactivateGame(gameId){
      let res = await this.request(`games/${gameId}/deactivate`, {}, 'patch')
      return res
  }

  /** reactivate game.  */

  static async reactivateGame(gameId){
      let res = await this.request(`games/${gameId}/reactivate`, {}, 'patch')
      return res
  }

}

export default PugApi;
