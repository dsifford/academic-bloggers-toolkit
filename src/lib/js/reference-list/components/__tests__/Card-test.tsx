jest.unmock('../Card');

import * as React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { Card } from '../Card';

const testdata = JSON.parse(`[["t63pg05",{"id":"t63pg05","type":"article","issued":{"date-parts":[["2013","04","29"]]},"title":"Theoretical and experimental results for the dynamic response of pressure measuring systems","author":[{"family":"Tijderman","given":"H."}],"URL":"https://www.researchgate.net/publication/267748828_Theoretical_and_experime…the_dynamic_response_of_pressure_measuring_systems_by_HBergh_and_HTijdeman","accessed":{"date-parts":[["2013","04","29"]]}}],["jdgiomrr",{"id":"jdgiomrr","type":"article","issued":{"date-parts":[["2016","04","15"]]},"title":"Annex 2 Appendix 4","author":[{"literal":"ICAO"}],"publisher":"ICAO","URL":"http://www.horoug.com/horoug_files/icao_regulations/ICAO%20Annex%202%20-%20Rules%20of%20the%20Air.pdf","accessed":{"date-parts":[["2016","04","15"]]}}],["1m0tqkabo",{"id":"1m0tqkabo","type":"article","issued":{"date-parts":[["2013","11","12"]]},"title":"Documentation center. Model generic linear sensor","publisher":"Mathworks Site","URL":"http://uk.mathworks.com/help/physmod/elec/ref/pssensor.html?s_tid=gn_loc_drop","accessed":{"date-parts":[["2013","11","12"]]}}],["18920od8t",{"id":"18920od8t","type":"report","issued":{"date-parts":[["2016","07","25"]]},"title":"Historical Development of Aircarft Flutter","author":[{"family":"Garrick","given":"I.E."},{"family":"Reed","given":"Wilmer H."}],"publisher-place":"Hampton, Va","language":"English","publisher":"NASA Langley Research Center","URL":"http://wpage.unina.it/marulo/dsa_wpage/history_of_flutter.pdf","accessed":{"date-parts":[["2016","07","25"]]}}],["1lgdrijr4",{"id":"1lgdrijr4","type":"article-journal","issued":{"date-parts":[["2016","04","17"]]},"title":"STRAIGHT-LINE PATH FOLLOWING IN WINDY CONDITIONS","author":[{"family":"Brezoescu","given":"A."},{"family":"Castillo","given":"P."},{"family":"Lozano","given":"R."}],"container-title":"ISPRS - International Archives of the Photogrammetry, Remote Sensing and Spatial Information Sciences","DOI":"10.5194/isprsarchives-XXXVIII-1-C22-283-2011","archive":"CrossRef","volume":"XXXVIII-1/C22","language":"en","ISBN":"1682-1777","ISSN":"1682-1777","URL":"http://www.geometh.ethz.ch/uav_g/proceedings/brezoescu","accessed":{"date-parts":[["2016","04","17"]]},"page":"283-288"}]]`);

const setup = (selected: boolean) => {
    const s = spy();
    const component = shallow(
        <Card isSelected={selected} CSL={testdata} click={s} id={'id'}/>
    );
    return {
        s,
        component,
    };
};

describe('<Card/>', () => {
    it('should render selected', () => {
        const { component } = setup(true);
        expect(component.first().props().className).toBe('abt-card selected');
    });
    it('should render unselected', () => {
        const { component } = setup(false);
        expect(component.first().props().className).toBe('abt-card');
    });
    it('should call onClick when clicked', () => {
        const { component, s } = setup(false);
        component.simulate('click');
        expect(s.callCount).toBe(1);
    });
});
