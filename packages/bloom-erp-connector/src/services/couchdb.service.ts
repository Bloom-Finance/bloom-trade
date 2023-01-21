import nano from 'nano';
import { ERPs, erpCredentials } from '../@types/index';
class CouchDB {
  private couchDbInstance: nano.ServerScope;
  private dbInstance: nano.DocumentScope<unknown>;
  constructor(user: string, password: string, db_name: string) {
    //staff
    this.couchDbInstance = nano(`http://${user}:${password}@localhost:5984`);
    this.dbInstance = this.couchDbInstance.db.use(db_name);
  }
  async updateCredentials(
    id: string,
    erpType: ERPs,
    erpCredentials: erpCredentials<ERPs>
  ): Promise<nano.DocumentInsertResponse> {
    const doc = await this.dbInstance.get(id);
    const res = await this.dbInstance.insert({
      [erpType]: {
        ...erpCredentials,
      },
      ...doc,
    });
    return res;
  }
  async insert(doc: any) {
    const res = await this.dbInstance.insert({
      _id: doc.id,
      ...doc,
    });
    return res;
  }
}

export default CouchDB;
