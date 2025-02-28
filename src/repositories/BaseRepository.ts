import { CreationAttributes, Model, ModelStatic, CreateOptions, FindOptions, DestroyOptions } from 'sequelize';

export abstract class BaseRepository<M extends Model> {
  abstract model(): ModelStatic<M>;

  async add(data: CreationAttributes<M>, createOptions: CreateOptions = {}): Promise<M> {
    return this.model().create(data, createOptions);
  }

  async findAll(findOptions: FindOptions = {}): Promise<M[]> {
    return this.model().findAll(findOptions);
  }

  async delete(id: number, deleteOptions: DestroyOptions = {}): Promise<number> {
    return this.model().destroy({ where: { id }, ...deleteOptions });
  }

  async findById(id: number, findOptions: FindOptions = {}): Promise<M | null> {
    return this.model().findByPk(id, findOptions);
  }
}
