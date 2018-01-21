import Role from './role';
import ROLE_TYPE from './ROLE_TYPE';

interface UpgraderMemory extends CreepMemory {
    upgrading: boolean;
}

export default class Upgrader implements Role {
    public roleName: ROLE_TYPE = ROLE_TYPE.ROLE_UPGRADER;

    /**
     * @param {Creep} creep
     */
    public run(creep: Creep) {
        const memory = creep.memory as UpgraderMemory;
        if (memory.upgrading && creep.carry.energy === 0) {
            memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            memory.upgrading = true;
            creep.say('🚧 upgrade');
        }

        if (memory.upgrading) {
            const controller = creep.room.controller;
            if(controller){
                if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller.pos, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}
