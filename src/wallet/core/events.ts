import { ApiPromise, ApiRx } from '@polkadot/api';
import { Vec } from '@polkadot/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { from, Observable } from 'rxjs';
import { filter, shareReplay, startWith, switchMap } from 'rxjs/operators';

export const eventMethodsFilter = (methods: string[]) => {
  return (event: EventRecord): boolean => {
    const method = event?.event?.method;

    return !!methods.find((item) => item === method);
  };
};

export const eventSectionsFilter = (sections: string[]) => {
  return (event: EventRecord): boolean => {
    const section = event?.event?.section;

    return !!sections.find((item) => item === section);
  };
};

export const eventsFilter = (data: { section: string; method: string }[]) => {
  return (event: EventRecord): boolean => {
    return data.reduce((acc, cur) => {
      const isSectionMatch = cur.section === '*' ? true : cur.section === event?.event?.section;

      const isMethodMatch = cur.method === '*' ? true : cur.method === event?.event?.method;

      return acc || (isSectionMatch && isMethodMatch);
    }, false as boolean);
  };
};

export const mockEventRecord = (section?: string, method?: string): Vec<EventRecord> => {
  return [{ event: { section, method } }] as any as Vec<EventRecord>;
};

export const eventsFilterRx = (
  api: ApiRx,
  configs: { section: string; method: string }[],
  immediately: boolean
): Observable<EventRecord> => {
  return api.query.system.events<Vec<EventRecord>>().pipe(
    startWith(immediately ? mockEventRecord(configs?.[0].section, configs?.[0].method) : []),
    switchMap((events) => from(events as unknown as Vec<EventRecord>)),
    filter(eventsFilter(configs)),
    shareReplay(1)
  );
};

export const eventsFilterCallback = (
  api: ApiPromise,
  configs: { section: string; method: string }[],
  immediately: boolean,
  callback: () => void
): void => {
  if (immediately) callback();

  api.query.system.events<Vec<EventRecord>>((events: Vec<EventRecord>) => {
    if (eventsFilter(configs)(events as unknown as EventRecord)) {
      callback();
    }
  });
};
