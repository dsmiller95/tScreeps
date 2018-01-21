import Role from './role';
import ROLE_TYPE from './ROLE_TYPE';

interface BuilderMemory extends CreepMemory {
    building: boolean;
}

export default class Builder implements Role {
    public roleName: ROLE_TYPE = ROLE_TYPE.ROLE_BUILDER;

    /**
     * @param {Creep} creep
     */
    public run(creep: Creep) {
        const memory = creep.memory as BuilderMemory;
        if (memory.building && creep.carry.energy === 0) {
            memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!memory.building && creep.carry.energy === creep.carryCapacity) {
            memory.building = true;
            creep.say('🚧 build');
        }

        if (memory.building) {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(25, 20);
            }
        } else {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}
