import { ErrorMapper } from 'utils/ErrorMapper';

import Role from 'roles/role';
import x from 'roles/index';

//const Role = x.Role;
const ROLE_TYPE = x.ROLE_TYPE;

const rolesMap: {[role: string]: Role} = {};

Role.list.forEach((mod) => rolesMap[mod.roleName] = mod);
if (!Memory.desiredTypes) {
  Memory.desiredTypes = {};
}
Memory.desiredTypes[ROLE_TYPE.ROLE_HARVESTER] = 3;

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  let constructionSites = 0;
  for (const siteName in Game.constructionSites) {
    const site = Game.constructionSites[siteName];
    if(site.my){
      constructionSites++;
    }
  }
  Memory.desiredTypes[ROLE_TYPE.ROLE_BUILDER] = constructionSites;

  Memory.desiredTypes[ROLE_TYPE.ROLE_UPGRADER] = _.map(Game.rooms, (room) => room.controller).filter(s => s).length;
  //Count up how many creeps of each role there are; compared to desired amounts
  const rolesCount: {[type: string]: number} = {};
  Object.keys(ROLE_TYPE).map(name => ROLE_TYPE[name as any])
    .forEach((key) => rolesCount[key] = 0);
  _.forEach(Game.creeps,
    (creep) => {
      const role = creep.memory.role;
      rolesCount[role] = rolesCount[role] ? rolesCount[role] + 1 : 1;
    });

  Object.keys(Memory.desiredTypes).forEach((role) => {
    const current = rolesCount[role];
    const desired = Memory.desiredTypes[role];
    rolesCount[role] = (current) ? desired - current : desired;
  });

  console.log(JSON.stringify(rolesCount));

  const spawn = Game.spawns.Spawn1;
  if(!spawn.spawning){
    for (const role in rolesCount) {
      if(rolesCount[role] > 0){
        const newName = role + Game.time;
        console.log('Spawning new ' + role + ': ' + newName);
        spawn.spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: role}});
        break;
      }
    }
  }

  if (spawn.spawning) {
      const spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(
          '🛠️' + spawningCreep.memory.role,
          spawn.pos.x + 1,
          spawn.pos.y,
          {align: 'left', opacity: 0.8});
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    const role = rolesMap[creep.memory.role];
    if (role) {
      role.run(creep);
    }
  }
});
