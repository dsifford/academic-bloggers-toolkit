import { createContext } from '@wordpress/element';

interface DataContext {
    data: Readonly<CSL.Data>;
    update<T extends keyof CSL.Data>(key: T, value: CSL.Data[T]): void;
}
export const DataContext = createContext<DataContext>({
    data: {
        id: '',
        type: 'article',
    },
    update() {
        return;
    },
});

type Person = Readonly<{ kind: CSL.PersonFieldKey } & CSL.Person>;

interface PeopleContext {
    people: readonly Person[];
    update(index: number, person: Person): void;
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
