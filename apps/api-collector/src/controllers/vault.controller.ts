import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Vault} from '../models';
import {VaultRepository} from '../repositories';
import {ApiResponse} from '../@types/';

export class VaultController {
  constructor(
    @repository(VaultRepository)
    public vaultRepository: VaultRepository,
  ) {}

  @post('/vaults')
  @response(200, {
    description: 'Vault model instance',
    content: {'application/json': {schema: getModelSchemaRef(Vault)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vault, {
            title: 'NewVault',
            exclude: ['_id'],
          }),
        },
      },
    })
    vault: Omit<Vault, '_id'>,
  ): Promise<ApiResponse<Vault>> {
    const createdVault = await this.vaultRepository.create(vault);
    return {
      data: createdVault,
      message: 'Vault created successfully',
      status: 200,
    };
  }

  @get('/vaults/count')
  @response(200, {
    description: 'Vault model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Vault) where?: Where<Vault>): Promise<Count> {
    return this.vaultRepository.count(where);
  }

  @get('/vaults')
  @response(200, {
    description: 'Array of Vault model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vault, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Vault) filter?: Filter<Vault>,
  ): Promise<ApiResponse<Vault[]>> {
    const foundVaults = await this.vaultRepository.find(filter);
    return {
      data: foundVaults,
      message: 'Vaults retrieved successfully',
      status: 200,
    };
  }

  @get('/vaults/{id}')
  @response(200, {
    description: 'Vault model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vault, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Vault, {exclude: 'where'})
    filter?: FilterExcludingWhere<Vault>,
  ): Promise<Vault> {
    return this.vaultRepository.findById(id, filter);
  }

  @patch('/vaults/{id}')
  @response(204, {
    description: 'Vault PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vault, {partial: true}),
        },
      },
    })
    vault: Vault,
  ): Promise<void> {
    await this.vaultRepository.updateById(id, vault);
  }

  @put('/vaults/{id}')
  @response(204, {
    description: 'Vault PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() vault: Vault,
  ): Promise<void> {
    await this.vaultRepository.replaceById(id, vault);
  }

  @del('/vaults/{id}')
  @response(204, {
    description: 'Vault DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.vaultRepository.deleteById(id);
  }
}
