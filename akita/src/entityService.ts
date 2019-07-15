import { OrArray, UpdateEntityPredicate, UpdateStateCallback } from './types';

export interface EntityServiceOption {
  loading: boolean;
  setStore: boolean;
}

export interface EntityService<EntityType, IDType, OptionType = any> {
  name: string;
  // CREATE
  add(entities: OrArray<EntityType>, options?: Partial<OptionType>);
  // READ
  get(ids?: OrArray<IDType>, options?: Partial<OptionType & EntityServiceOption>);
  get(options?: Partial<OptionType & EntityServiceOption>);
  // UPDATE
  update(id: OrArray<IDType> | null | UpdateEntityPredicate<EntityType>, newState: UpdateStateCallback<EntityType> | Partial<EntityType>, options?: OptionType);
  // DELETE
  remove(id?: OrArray<IDType>, options?: OptionType);
  remove(predicate: (entity: Readonly<EntityType>) => boolean, options?: OptionType);
}
