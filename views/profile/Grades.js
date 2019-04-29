import React from 'react';
import {
  Text, View, ActivityIndicator, ScrollView,
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import DropdownAlert from 'react-native-dropdownalert';
import Accordion from 'react-native-collapsible/Accordion';
import {
  Tag, RoundedCardTitle,
} from '../../components';
import { logout } from '../../auth';
import { FN } from '../../styles';
import globals from '../../globals.js';
import translate_term from '../../data/translate_term';
import translate_course from '../../data/translate_course_title';

function gradeColor(attempted, points) {
  if (attempted == 0) return '#2699FB';
  const ratio = points / (attempted * 4);
  const curve = (ratio, scale) => scale * ((Math.pow((ratio * 2) - 1, 3) + 1) / 2);
  return `hsl(${curve(ratio, 100)},80%,50%)`;
}

export default class GradesScreen extends React.Component {
  static navigationOptions = {
    title: 'GRADES',
  }

  componentWillMount() {
    this.setState({
      loaded: false, failed: false, gpa: '', activeSections: [0], grades: [],
    });
    if (globals.GRADES.loaded) this.loadInfo(globals.GRADES);
    else EventRegister.addEventListener('load_grades', data => this.loadInfo(data));
  }

  componentDidMount() {
    if (this.state.failed) this.dropdown.alertWithType('error', 'Failed to load', "Looks like we're having trouble pulling up your grades.");
  }

  _renderHeader = (section, index, isActive) => (
    <View style={{
      backgroundColor: '#EFEFEF',
      padding: 15,
      borderBottomColor: '#D0D0D0',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}
    >
      <Text style={{
        color: '#707070',
        flexDirection: 'column',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: FN(16),
      }}
      >
        {section.term}
      </Text>
      <Text style={{ color: '#707070', fontSize: FN(20) }}>{isActive ? '-' : '+'}</Text>
    </View>
  );

  _renderContent = (section) => {
    let total = 0;
    let earned = 0;
    for (const i in section.content) {
      total += parseFloat(section.content[i].GPA_HRS);
      earned += parseFloat(section.content[i].POINTS);
    }
    const gpa = Number((earned / total).toFixed(2));
    return (
      <View style={{
        backgroundColor: '#F4FAFF',
        padding: FN(20),
      }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          <Text style={{
            color: '#6F9AAA',
            fontFamily: 'Arial',
            fontSize: FN(18),
            fontWeight: 'bold',
          }}
          >
CLASSES:
          </Text>
          <Tag>
            {gpa}
            {' '}
GPA
          </Tag>
        </View>
        {section.content.map(data => (
          <View
            key={data.CRN}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={{ fontSize: FN(18), fontWeight: 'bold' }}>{translate_course(data.TITLE)}</Text>
              <Text style={{ fontSize: FN(14), color: '#717171', paddingTop: 2 }}>{`${data.SUBJ} ${data.COURSE}`}</Text>
              <Text style={{
                fontSize: FN(16), color: '#717171', fontWeight: 'bold', paddingTop: 2,
              }}
              >
                {`${Math.floor(data.ATTEMPTED)} credits`}
              </Text>
            </View>
            <View style={{
              backgroundColor: gradeColor(data.GPA_HRS, data.POINTS),
              width: FN(50),
              height: FN(50),
              borderRadius: FN(10),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              <Text style={{ color: 'white', fontSize: FN(20), fontWeight: 'bold' }}>{data.GRADE}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  _updateSections = (activeSections) => {
    this.setState({ activeSections });
  };

  loadInfo(data) {
    if (data) {
      const grades = [];
      for (entry in data) if (entry != 'loaded' && entry != 'gpa') grades.push({ term: translate_term(entry), content: data[entry] });
      grades.sort().reverse();
      this.setState({ grades, gpa: data.gpa });
    } else this.setState({ failed: true });
    this.setState({ loaded: true });
  }

  render() {
    const {
      loaded, failed, gpa, grades, activeSections,
    } = this.state;
    return (
      <React.Fragment>
        {!loaded && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
        )}
        {!failed
          && (
          <ScrollView>
            <View style={{
              padding: FN(15),
              paddingTop: FN(20),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            >
              <RoundedCardTitle>Overall</RoundedCardTitle>
              <Tag>
                {Number.parseFloat(gpa).toFixed(2)}
                {' '}
GPA
              </Tag>
            </View>
            <Accordion
              sections={grades}
              activeSections={activeSections}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this._updateSections}
            />
          </ScrollView>
          )}
        <DropdownAlert ref={ref => this.dropdown = ref} inactiveStatusBarStyle="default" />
      </React.Fragment>
    );
  }
}
