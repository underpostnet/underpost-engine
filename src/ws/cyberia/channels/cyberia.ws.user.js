import { objectEquals } from '../../../client/components/core/CommonJs.js';
import { BaseElement, Stat } from '../../../client/components/cyberia/CommonCyberia.js';
import { DataBaseProvider } from '../../../db/DataBaseProvider.js';
import { loggerFactory } from '../../../server/logger.js';
import { IoCreateChannel } from '../../IoInterface.js';
import { CyberiaWsEmit } from '../cyberia.ws.emit.js';
import { CyberiaWsSkillManagement } from '../management/cyberia.ws.skill.js';
import { CyberiaWsUserManagement } from '../management/cyberia.ws.user.js';
import { CyberiaWsSkillChannel } from './cyberia.ws.skill.js';
import dotenv from 'dotenv';

dotenv.config();

const channel = 'user';
const logger = loggerFactory(import.meta);

const CyberiaWsUserController = {
  channel,
  controller: async function (socket, client, args, wsManagementId) {
    const { status, element, user } = args;
    const propagate = () => {
      for (const elementId of Object.keys(CyberiaWsUserManagement.element[wsManagementId])) {
        if (
          socket.id !== elementId &&
          objectEquals(
            CyberiaWsUserManagement.element[wsManagementId][elementId].model.world,
            CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world,
          )
        ) {
          CyberiaWsEmit(channel, client[elementId], {
            status: 'connection',
            id: socket.id,
            element: CyberiaWsUserManagement.element[wsManagementId][socket.id],
          });
        }
      }
      if (CyberiaWsUserManagement.element[wsManagementId][socket.id].life <= 0)
        CyberiaWsUserManagement.setDeadState(wsManagementId, socket.id);
    };
    switch (status) {
      case 'propagate':
        propagate();
        break;
      case 'register-user':
        CyberiaWsUserManagement.element[wsManagementId][socket.id].model.user._id = user._id;
        CyberiaWsUserManagement.element[wsManagementId][socket.id].model.user.username = user.username;
        break;
      case 'unregister-user':
        CyberiaWsUserManagement.element[wsManagementId][socket.id].model.user = { _id: '' };
        break;
      case 'register-cyberia-user':
        {
          /** @type {import('../../../api/cyberia-user/cyberia-user.model.js').CyberiaUserModel} */
          const CyberiaUser = DataBaseProvider.instance[`${wsManagementId}`].mongoose.CyberiaUser;
          /** @type {import('../../../api/cyberia-world/cyberia-world.model.js').CyberiaWorldModel} */
          const CyberiaWorld = DataBaseProvider.instance[`${wsManagementId}`].mongoose.CyberiaWorld;

          const userDoc = await CyberiaUser.findById(args.user._id);
          const user = userDoc._doc;
          user.model.user = CyberiaWsUserManagement.element[wsManagementId][socket.id].model.user;
          user.model.world._id = user.model.world._id.toString();

          const worldDoc = await CyberiaWorld.findById(user.model.world._id);
          if (!worldDoc) {
            const baseElement = BaseElement({
              worldId: process.env.CYBERIA_WORLD_ID,
            }).user.main;
            user.model.world = baseElement.model.world;
            user.x = baseElement.x;
            user.y = baseElement.y;
          }

          user._id = user._id.toString();
          CyberiaWsUserManagement.element[wsManagementId][socket.id] = {
            ...CyberiaWsUserManagement.element[wsManagementId][socket.id],
            ...user,
          };
          CyberiaWsUserManagement.element[wsManagementId][socket.id] = Stat.set(
            channel,
            CyberiaWsUserManagement.element[wsManagementId][socket.id],
          );
          propagate();
        }
        break;
      case 'unregister-cyberia-user':
        {
          CyberiaWsUserManagement.element[wsManagementId][socket.id] = BaseElement({
            worldId: process.env.CYBERIA_WORLD_ID,
          }).user.main;
          propagate();
        }
        break;
      case 'update-position':
        CyberiaWsUserManagement.element[wsManagementId][socket.id].x = element.x;
        CyberiaWsUserManagement.element[wsManagementId][socket.id].y = element.y;
        for (const elementId of Object.keys(CyberiaWsUserManagement.element[wsManagementId])) {
          if (
            elementId !== socket.id &&
            objectEquals(
              CyberiaWsUserManagement.element[wsManagementId][elementId].model.world,
              CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world,
            )
          ) {
            CyberiaWsEmit(channel, client[elementId], {
              status,
              id: socket.id,
              element: { x: element.x, y: element.y },
            });
          }
        }
        break;
      case 'update-world-face':
        for (const elementId of Object.keys(CyberiaWsUserManagement.element[wsManagementId])) {
          if (
            elementId !== socket.id &&
            objectEquals(
              CyberiaWsUserManagement.element[wsManagementId][elementId].model.world,
              CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world,
            )
          ) {
            CyberiaWsEmit(channel, client[elementId], {
              status: 'disconnect',
              id: socket.id,
            });
          }
        }
        CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world = element.model.world;
        for (const elementId of Object.keys(CyberiaWsUserManagement.element[wsManagementId])) {
          if (
            objectEquals(
              CyberiaWsUserManagement.element[wsManagementId][elementId].model.world,
              CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world,
            )
          ) {
            if (elementId !== socket.id) {
              CyberiaWsEmit(channel, client[elementId], {
                status: 'connection',
                id: socket.id,
                element: CyberiaWsUserManagement.element[wsManagementId][socket.id],
              });
              CyberiaWsEmit(channel, socket, {
                status: 'connection',
                id: elementId,
                element: CyberiaWsUserManagement.element[wsManagementId][elementId],
              });
            }
          }
        }
        for (const elementId of Object.keys(CyberiaWsSkillManagement.element[wsManagementId])) {
          if (
            objectEquals(
              CyberiaWsSkillManagement.element[wsManagementId][elementId].model.world,
              CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world,
            )
          ) {
            CyberiaWsEmit(CyberiaWsSkillChannel.channel, socket, {
              status: 'connection',
              id: elementId,
              element: CyberiaWsSkillManagement.element[wsManagementId][elementId],
            });
          }
        }
        break;

      case 'update-skill':
        CyberiaWsUserManagement.element[wsManagementId][socket.id].skill = element.skill;
        break;
      case 'update-skin-position':
        CyberiaWsUserManagement.element[wsManagementId][socket.id].components.skin = element.components.skin;
        if (args.updateStat)
          CyberiaWsUserManagement.element[wsManagementId][socket.id] = Stat.set(
            channel,
            CyberiaWsUserManagement.element[wsManagementId][socket.id],
          );
        CyberiaWsUserManagement.localElementScope[wsManagementId][socket.id].direction = args.direction;
        for (const elementId of Object.keys(CyberiaWsUserManagement.element[wsManagementId])) {
          if (
            elementId !== socket.id &&
            objectEquals(
              CyberiaWsUserManagement.element[wsManagementId][elementId].model.world,
              CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world,
            )
          ) {
            CyberiaWsEmit(channel, client[elementId], {
              status,
              id: socket.id,
              element: { components: { skin: element.components.skin } },
              updateStat: args.updateStat,
            });
          }
        }
        break;
      case 'update-item':
        {
          const { itemType } = args;
          const elementUpdate = { components: {} };
          elementUpdate.components[itemType] = element.components[itemType];
          CyberiaWsUserManagement.element[wsManagementId][socket.id].components[itemType] =
            element.components[itemType];
          CyberiaWsUserManagement.element[wsManagementId][socket.id] = Stat.set(
            channel,
            CyberiaWsUserManagement.element[wsManagementId][socket.id],
          );

          for (const elementId of Object.keys(CyberiaWsUserManagement.element[wsManagementId])) {
            if (
              elementId !== socket.id &&
              objectEquals(
                CyberiaWsUserManagement.element[wsManagementId][elementId].model.world,
                CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world,
              )
            ) {
              CyberiaWsEmit(channel, client[elementId], {
                status,
                id: socket.id,
                itemType,
                element: elementUpdate,
              });
            }
          }
        }
        break;
      default:
        break;
    }
  },
  connection: function (socket, client, wsManagementId) {
    CyberiaWsUserManagement.element[wsManagementId][socket.id] = BaseElement({ worldId: process.env.CYBERIA_WORLD_ID })[
      channel
    ].main;
    CyberiaWsUserManagement.localElementScope[wsManagementId][socket.id] = {
      direction: 's',
    };
    CyberiaWsEmit(channel, socket, {
      status: 'connection',
      id: socket.id,
      element: CyberiaWsUserManagement.element[wsManagementId][socket.id],
    });
    for (const elementId of Object.keys(CyberiaWsUserManagement.element[wsManagementId])) {
      if (
        objectEquals(
          CyberiaWsUserManagement.element[wsManagementId][elementId].model.world,
          CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world,
        )
      ) {
        if (elementId !== socket.id)
          CyberiaWsEmit(channel, socket, {
            status: 'connection',
            id: elementId,
            element: CyberiaWsUserManagement.element[wsManagementId][elementId],
          });
      }
    }
  },
  disconnect: function (socket, client, reason, wsManagementId) {
    for (const elementId of Object.keys(CyberiaWsUserManagement.element[wsManagementId])) {
      if (
        elementId !== socket.id &&
        objectEquals(
          CyberiaWsUserManagement.element[wsManagementId][elementId].model.world,
          CyberiaWsUserManagement.element[wsManagementId][socket.id].model.world,
        )
      )
        CyberiaWsEmit(channel, client[elementId], {
          status: 'disconnect',
          id: socket.id,
        });
    }
    delete CyberiaWsUserManagement.element[wsManagementId][socket.id];
    delete CyberiaWsUserManagement.localElementScope[wsManagementId][socket.id];
  },
};

const CyberiaWsUserChannel = IoCreateChannel(CyberiaWsUserController);

export { CyberiaWsUserChannel, CyberiaWsUserController };
