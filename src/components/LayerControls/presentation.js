import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import casesConfig from '../../config/cases';
import './style.scss';
import {ButtonSwitch, ButtonSwitchOption} from '@gisatcz/ptr-atoms';

class LayerControls extends React.PureComponent {
	constructor(props) {
		super(props);

		this.switchToModel = this.switchToModel.bind(this);
		this.switchToActual = this.switchToActual.bind(this);
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	switchToModel(value, e) {
		if (value && this.props.templateKeys && this.props.periods) {
			let templates = this.props.templateKeys;
			let latestPeriodKey = this.props.periods[0].key;
			switch (value) {
				case 'gis1':
					if (templates.modelGis && templates.modelGis.year1) {
						this.props.setActive(
							templates.modelGis.year1,
							latestPeriodKey
						);
					}
					break;
				case 'gis3':
					if (templates.modelGis && templates.modelGis.year3) {
						this.props.setActive(
							templates.modelGis.year3,
							latestPeriodKey
						);
					}
					break;
				case 'gis10':
					if (templates.modelGis && templates.modelGis.year10) {
						this.props.setActive(
							templates.modelGis.year10,
							latestPeriodKey
						);
					}
					break;
				case 'gam':
					if (
						templates.modelBiomod &&
						templates.modelBiomod.generalisedLinear
					) {
						this.props.setActive(
							this.props.templateKeys.modelBiomod
								.generalisedLinear,
							latestPeriodKey
						);
					}
					break;
				case 'gbm':
					if (
						templates.modelBiomod &&
						templates.modelBiomod.gradientBoosting
					) {
						this.props.setActive(
							this.props.templateKeys.modelBiomod
								.gradientBoosting,
							latestPeriodKey
						);
					}
					break;
				case 'maxent':
					if (
						templates.modelBiomod &&
						templates.modelBiomod.maximumEntropy
					) {
						this.props.setActive(
							this.props.templateKeys.modelBiomod.maximumEntropy,
							latestPeriodKey
						);
					}
					break;
			}
		}
	}

	switchToActual(periodKey, e) {
		if (periodKey && this.props.templateKeys) {
			let actualTemplateKey = this.props.templateKeys.actualExpansion;

			this.props.setActive(actualTemplateKey, periodKey);
		}
	}

	render() {
		const props = this.props;
		const templateKeys = props.templateKeys;
		const caseConfig = this.props.activeCase && casesConfig[this.props.activeCase.key];

		// No data for case
		if (caseConfig && caseConfig.nothing) {
			return (
				<div className="tacrGeoinvaze-layer-controls">
					{caseConfig.nothing}
				</div>
			);
		}

		let actualExpansionInsert = null;
		let actualExpansionActive =
			props.templateKeys &&
			props.templateKeys.actualExpansion === props.activeLayerTemplateKey;
		let actualExpansionClassNames = classNames(
			'tacrGeoinvaze-actual-expansion',
			{
				active: actualExpansionActive,
			}
		);

		if (props.isCrayfish) {
			actualExpansionInsert = (
				<div className={actualExpansionClassNames}>
					<div className="tacrGeoinvaze-layer-title">
						Skutečné rozšíření
					</div>
					<div className="tacrGeoinvaze-layer-description">
						Mapa VÚV TGM
					</div>
				</div>
			);
		} else {
			if (this.props.periods) {
				let latestPeriods = this.props.periods.slice(0, 3); //todo all periods to select

				actualExpansionInsert = (
					<div className={actualExpansionClassNames}>
						<div className="tacrGeoinvaze-layer-title">
							Skutečné rozšíření
						</div>
						<div>
							<ButtonSwitch onClick={this.switchToActual} ghost>
								{latestPeriods.map((period) => (
									<ButtonSwitchOption
										key={period.key}
										active={
											actualExpansionActive &&
											period.key ===
												this.props.activePeriodKey
										}
										value={period.key}
									>
										{period.data.nameDisplay}
									</ButtonSwitchOption>
								))}
							</ButtonSwitch>
							{/*<Select/>*/}
						</div>
						<div className="tacrGeoinvaze-layer-legend point">
							<div>
								<div>
									<span style={{backgroundColor: '#00f'}} />
									Zaznamenaný výskyt
								</div>
							</div>
						</div>
					</div>
				);
			} else {
				actualExpansionInsert = (
					<div className={actualExpansionClassNames}>
						<div className="tacrGeoinvaze-layer-title">
							Skutečné rozšíření
						</div>
						<div>(žádná data)</div>
					</div>
				);
			}
		}

		let gis1active =
			this.props.activeLayerTemplateKey ===
			(templateKeys &&
				templateKeys.modelGis &&
				templateKeys.modelGis.year1);
		let gis3active =
			this.props.activeLayerTemplateKey ===
			(templateKeys &&
				templateKeys.modelGis &&
				templateKeys.modelGis.year3);
		let gis10active =
			this.props.activeLayerTemplateKey ===
			(templateKeys &&
				templateKeys.modelGis &&
				templateKeys.modelGis.year10);
		let gamActive =
			this.props.activeLayerTemplateKey ===
			(templateKeys &&
				templateKeys.modelBiomod &&
				templateKeys.modelBiomod.generalisedLinear);
		let gbmActive =
			this.props.activeLayerTemplateKey ===
			(templateKeys &&
				templateKeys.modelBiomod &&
				templateKeys.modelBiomod.gradientBoosting);
		let maxentActive =
			this.props.activeLayerTemplateKey ===
			(templateKeys &&
				templateKeys.modelBiomod &&
				templateKeys.modelBiomod.maximumEntropy);

		let modelsInsert = null;

		if (caseConfig && caseConfig.noModels) {
			modelsInsert = <div>{caseConfig.noModels}</div>;
		} else {
			let gisModelInsert = null;
			let biomodModelInsert = null;

			if (caseConfig && caseConfig.noGisModel) {
				gisModelInsert = <div>{caseConfig.noGisModel}</div>
			} else {
				gisModelInsert = (
					<div
						className={classNames('tacrGeoinvaze-model-gis', {
							active: gis1active || gis3active || gis10active,
						})}
					>
						<div className="tacrGeoinvaze-layer-title">
							Model budoucího rozšíření &ndash; horizont
						</div>
						<div>
							<ButtonSwitch onClick={this.switchToModel} ghost>
								<ButtonSwitchOption
									active={gis1active}
									value={'gis1'}
								>
									krátkodobý
								</ButtonSwitchOption>
								<ButtonSwitchOption
									active={gis3active}
									value={'gis3'}
								>
									střednědobý
								</ButtonSwitchOption>
								<ButtonSwitchOption
									active={gis10active}
									value={'gis10'}
								>
									dlouhodobý
								</ButtonSwitchOption>
							</ButtonSwitch>
						</div>

						<div className="tacrGeoinvaze-layer-legend discrete">
							<div>
								<span>Pravděpodobnost rozšíření:</span>
								<div className="tacrGeoinvaze-layer-legend-group">
									<div className="tacrGeoinvaze-layer-legend-record">
										<span style={{backgroundColor: '#f00'}} />
										Vysoká
									</div>
									<div className="tacrGeoinvaze-layer-legend-record">
										<span
											style={{backgroundColor: '#FF7F00'}}
										/>
										Nízká
									</div>
									<div className="tacrGeoinvaze-layer-legend-record">
										<span
											style={{backgroundColor: '#7FBF00'}}
										/>
										Velmi nízká
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			}

			if (caseConfig && caseConfig.noBiomodModel) {
				biomodModelInsert = <div>{caseConfig.noBiomodModel}</div>
			} else {
				let biomodModelMessageInsert = null;
				if (caseConfig && caseConfig.noBiomodParticularModel) {
					biomodModelMessageInsert = _.map(caseConfig.noBiomodParticularModel, message =>
						<div>{message}</div>
					);
				}

				biomodModelInsert = (
					<div
						className={classNames('tacrGeoinvaze-model-biomod', {
							active: gamActive || gbmActive || maxentActive,
						})}
					>
						<div className="tacrGeoinvaze-layer-title">
							Model maximálního možného rozšíření
						</div>
						<div>
							<ButtonSwitch onClick={this.switchToModel} ghost>
								<ButtonSwitchOption
									active={gamActive}
									value={'gam'}
									disabled={caseConfig && caseConfig.noBiomodParticularModel && caseConfig.noBiomodParticularModel.noBiomodModelGAM}
								>
									GAM
								</ButtonSwitchOption>
								<ButtonSwitchOption
									active={gbmActive}
									value={'gbm'}
									disabled={caseConfig && caseConfig.noBiomodParticularModel && caseConfig.noBiomodParticularModel.noBiomodModelGBM}
								>
									GBM
								</ButtonSwitchOption>
								<ButtonSwitchOption
									active={maxentActive}
									value={'maxent'}
									disabled={caseConfig && caseConfig.noBiomodParticularModel && caseConfig.noBiomodParticularModel.noBiomodModelMAXENT}
								>
									MAXENT
								</ButtonSwitchOption>
							</ButtonSwitch>
						</div>
						<div className="tacrGeoinvaze-layer-legend continuous">
							<div>
								<span />
								<div>
									<div className="tacrGeoinvaze-layer-legend-point start">
										0 %
									</div>
									<div className="tacrGeoinvaze-layer-legend-point end">
										100 %
									</div>
								</div>
							</div>
						</div>
						{biomodModelMessageInsert}
					</div>
				);
			}

			modelsInsert = (
				<>
					{gisModelInsert}
					{biomodModelInsert}
				</>
			);
		}

		return (
			<div className="tacrGeoinvaze-layer-controls">
				{actualExpansionInsert}
				{modelsInsert}
			</div>
		);
	}
}

export default LayerControls;
