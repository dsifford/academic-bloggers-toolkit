import { createContext } from '@wordpress/element';

interface DataContext {
    data: Readonly<Partial<CSL.Data>>;
    update<T extends keyof CSL.Data>(key: T, value: CSL.Data[T]): void;
}
export const DataContext = createContext<DataContext>({
    data: {},
    update() {
        return;
    },
});

interface PeopleContext {
    people: ReadonlyArray<Readonly<{ kind: CSL.PersonFieldKey } & CSL.Person>>;
    update(
        index: number,
        person: { kind: CSL.PersonFieldKey } & CSL.Person,
    ): void;
    add(): void;
    remove(): void;
}
export const PeopleContext = createContext<PeopleContext>({
    people: [],
    update() {
        return;
    },
    add() {
        return;
    },
    remove() {
        return;
    },
});
