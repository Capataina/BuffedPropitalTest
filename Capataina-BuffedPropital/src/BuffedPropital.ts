import { DependencyContainer } from "tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

class BuffedPropital implements IPreAkiLoadMod, IPostDBLoadMod {
  public postDBLoad(container: DependencyContainer): void {
    // get database from server
    const databaseServer = container
      .resolve<DatabaseServer>("DatabaseServer")
      .getTables();

    // Get all the in-memory json found in /assets/database
    const therapist = databaseServer.traders["54cb57776803fa99248b456e"];

    //Random imports
    const jsonUtil = container.resolve("JsonUtil");
    const locales = Object.values(databaseServer.locales.global);
    const handbook = databaseServer.templates.handbook;

    let BuffedPropitalBuffs = [
      {
        AbsoluteValue: true,
        BuffType: "HealthRate",
        Chance: 1,
        Delay: 1,
        Duration: 900,
        SkillName: "",
        Value: 5,
      },
      {
        AbsoluteValue: true,
        BuffType: "HealthRate",
        Chance: 1,
        Delay: 1,
        Duration: 60,
        SkillName: "",
        Value: 12,
      },
      {
        AbsoluteValue: true,
        BuffType: "MaxStamina",
        Chance: 1,
        Delay: 1,
        Duration: 300,
        SkillName: "",
        Value: 25,
      },
      {
        AbsoluteValue: true,
        BuffType: "StaminaRate",
        Chance: 1,
        Delay: 1,
        Duration: 300,
        SkillName: "",
        Value: 2,
      },
      {
        AbsoluteValue: true,
        BuffType: "SkillRate",
        Chance: 1,
        Delay: 1,
        Duration: 450,
        SkillName: "Metabolism",
        Value: 25,
      },
      {
        AbsoluteValue: true,
        BuffType: "SkillRate",
        Chance: 1,
        Delay: 1,
        Duration: 450,
        SkillName: "Health",
        Value: 25,
      },
      {
        AbsoluteValue: true,
        BuffType: "SkillRate",
        Chance: 1,
        Delay: 1,
        Duration: 450,
        SkillName: "Vitality",
        Value: 25,
      },
      {
        AbsoluteValue: true,
        BuffType: "RemoveAllBloodLosses",
        Chance: 1,
        Delay: 0,
        Duration: 300,
        SkillName: "",
        Value: 0,
      },
    ];

    let BuffedPropitalDamageEffects = {
      LightBleeding: {
        delay: 0,
        duration: 300,
        fadeOut: 0,
      },
      HeavyBleeding: {
        delay: 0,
        duration: 300,
        fadeOut: 0,
      },
      Pain: {
        delay: 0,
        duration: 450,
        fadeOut: 0,
      },
    };

    let BuffedPropitalMaxUse = 3;

    //Stim
    let regenStimId = "buffedPropital_CombatStim";
    let regenStimCategory = "5448f3a64bdc2d60728b456a";
    let regenStimFleaPrice = 155000;
    let regenStimName = "SpecOps Black EDR-3G Combat Stim";
    let regenStimShortName = "SpecOps EDR-3G";
    let regenStimDescription =
      "A 'super soldier serum' that infuses the blood with immense amounts of blood cells, providing temporary stimulating and empowering effects.";
    let regenStimTraderPrice = 175000;

    databaseServer.globals.config.Health.Effects.Stimulator.Buffs[
      "buffedPropital_CombatStim"
    ] = BuffedPropitalBuffs;

    const itemBuffedPropital = jsonUtil.clone(
      databaseServer.templates.items["5c0e534186f7747fa1419867"]
    );

    BuffedPropital.addStimData(
      itemBuffedPropital,
      regenStimId,
      "assets/content/weapons/usable_items/item_syringe/item_stimulator_sj12_tglabs_loot.bundle",
      "assets/content/weapons/usable_items/item_syringe/item_stimulator_sj12_tglabs_container.bundle",
      BuffedPropitalMaxUse,
      "buffedPropital_CombatStim"
    );

    databaseServer.templates.items[regenStimId] = itemBuffedPropital;

    itemBuffedPropital._props.effects_damage = BuffedPropitalDamageEffects;

    BuffedPropital.addLocales(
      locales,
      regenStimId,
      regenStimName,
      regenStimShortName,
      regenStimDescription
    );
    BuffedPropital.addHandbookItem(
      handbook,
      regenStimId,
      regenStimCategory,
      regenStimFleaPrice
    );
    BuffedPropital.addStimToTrader(
      therapist,
      regenStimId,
      regenStimTraderPrice,
      100,
      1
    );
    databaseServer.templates.items[
      "619cbf7d23893217ec30b689"
    ]._props.Grids[0]._props.filters[0].Filter.push(regenStimId);
  }

  // Create a method to add a stim to the trader
  static addStimToTrader(
    trader,
    stimId,
    stimPrice,
    stimCount,
    stimLoyaltyLevel
  ) {
    trader.assort.items.push({
      _id: stimId,
      _tpl: stimId,
      parentId: "hideout",
      slotId: "hideout",
      upd: {
        UnlimitedCount: true,
        StackObjectsCount: stimCount,
      },
    });
    trader.assort.barter_scheme[stimId] = [
      [
        {
          count: stimPrice,
          _tpl: "5449016a4bdc2d6f028b456f", // roubles
        },
      ],
    ];
    trader.assort.loyal_level_items[stimId] = stimLoyaltyLevel;
  }

  // Create a method to add data buffs, id, prefab path, useprefab path, to a specific item
  static addStimData(
    stimItem,
    id,
    prefabPath,
    usePrefabPath,
    maxHpResource,
    buffs
  ) {
    stimItem._id = id;
    stimItem._props.Prefab.path = prefabPath;
    stimItem._props.UsePrefab.path = usePrefabPath;
    stimItem._props.MaxHpResource = maxHpResource;
    stimItem._props.StimulatorBuffs = buffs;
  }

  // Create a method to add locales for an item
  static addLocales(locales, id, name, shortName, description) {
    for (const locale of locales) {
      locale[`${id} Name`] = name;
      locale[`${id} ShortName`] = shortName;
      locale[`${id} Description`] = description;
    }
  }

  // Create a method to add an item to the handbook
  static addHandbookItem(handbook, id, parentId, price) {
    handbook.Items.push({
      Id: id,
      ParentId: parentId,
      Price: price,
    });
  }
}

module.exports = { mod: new BuffedPropital() };
