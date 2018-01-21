import ROLE_TYPE from './ROLE_TYPE';

export default abstract class Role {
    public static list: Role[] = [];

    public roleName: ROLE_TYPE;

    public abstract run(creep: Creep): void;
}
