import Builder from './builder';
import Harvester from './harvester';
import Role from './role';
import ROLE_TYPE from './ROLE_TYPE';

Role.list.push(new Builder(), new Harvester());

export default {Builder, Harvester, Role, ROLE_TYPE};
