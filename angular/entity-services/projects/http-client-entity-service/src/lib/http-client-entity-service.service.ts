import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EntityState, EntityService, EntityStore, getEntityType, getIDType, OrArray, EntityServiceOption } from '@datorama/akita';
import { HttpEntityServiceConfig } from './http-client-entity-service.config';

interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams | { [param: string]: string | string[] };
  reportProgress?: boolean;
  responseType: 'arraybuffer' | 'blob' | 'text' | 'json';
  withCredentials?: boolean;
}

function restUrl(baseApi: string, name: string, id?: string | number) {
  // TODO : check if it match the format we want to define
  return id ? `${baseApi}/${name}/${id}` : `${baseApi}/${name}`;
}

@Injectable({
  providedIn: 'root'
})
class HttpClientEntityService<S extends EntityState> implements EntityService<getEntityType<S>, getIDType<S>, HttpOptions> {
  constructor(protected http: HttpClient, protected store: EntityStore<S>, protected config?: HttpEntityServiceConfig) {}

  get baseApi() {
    return this['constructor']['baseApi'] || this.config.baseApi;
  }

  get name() {
    return this['constructor']['name'] || this.store.storeName;
  }

  /** Get the value without updating the store */
  get(ids?: OrArray<getIDType<S>>, options?: Partial<HttpOptions & EntityServiceOption>);
  get(options?: Partial<HttpOptions & EntityServiceOption>);
  get(idsOrOptions?: OrArray<getIDType<S>> | Partial<HttpOptions & EntityServiceOption>, options?: Partial<HttpOptions & EntityServiceOption>) {
    let id: getIDType<S>;
    if (Array.isArray(idsOrOptions)) {
      const getEntities = idsOrOptions.map(entityId => this.get(entityId));
      // TODO : should apply transaction. But how to
      return Promise.all(getEntities);
    }
    if (typeof idsOrOptions === 'object') {
      options = idsOrOptions;
    } else if (typeof idsOrOptions === 'number' || typeof idsOrOptions === 'string') {
      id = idsOrOptions;
    } else if (typeof idsOrOptions === 'function') {
    }

    if (options.loading) {
      this.store.setLoading(true);
    }

    const url = restUrl(this.baseApi, this.name, id);
    return new Promise((res, rej) => {
      this.http.request('GET', url, options).subscribe({
        next: (entities: OrArray<getEntityType<S>>) => {
          if (options.setStore) {
            Array.isArray(entities) ? this.store.upsertMany(entities) : this.store.upsert(entities[this.store.idKey], entities);
          }
          if (options.loading) {
            this.store.setLoading(false);
          }
          res(entities);
        },
        error: (err: Error) => {
          if (options.setStore) {
            this.store.setError(err);
          }
          if (options.loading) {
            this.store.setLoading(false);
          }
          rej(err);
        }
      });
    });
  }

  async add() {
    return;
  }

  async update() {
    return;
  }

  async remove() {
    return;
  }
}
