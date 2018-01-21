import Builder from './builder';
import Harvester from './harvester';
import Role from './role';
import ROLE_TYPE from './ROLE_TYPE';
import Upgrader from 'roles/upgrader';

Role.list.push(new Builder(), new Harvester(), new Upgrader());

export default {Builder, Harvester, Role, ROLE_TYPE};
