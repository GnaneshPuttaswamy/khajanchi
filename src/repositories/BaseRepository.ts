import {
  CreationAttributes,
  Model,
  ModelStatic,
  CreateOptions,
  FindOptions,
  DestroyOptions,
  UpdateOptions,
  WhereOptions,
  Op,
} from 'sequelize';

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

  async updateById(
    id: number,
    data: Partial<CreationAttributes<M>>,
    updateOptions?: UpdateOptions
  ): Promise<[affectedCount: number]> {
    const where: WhereOptions = {
      id: {
        [Op.eq]: id,
      },
    };

    return this.model().update(data, { ...updateOptions, where });
  }
}
