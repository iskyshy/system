package com.czy.seed.mvc.wbm.config.entity.type;/*
 * 文 件 名 : AboutIndexConfigBean
 * 版    权 : CZYSOFT TECHNOLOGY CO.,LTD.Copyright 2017-2030.All rights reserved
 * 描    述 : <描述>
 * 修 改 人 : <工号>xu.yang22@zte.com.cn
 * 修改时间 : 2017/6/7 16:22
 * 需求单号 : <需求Redmine单号>
 * 变更单号 : <变更Redmine单号>
 * 修改内容 : <修改内容>
 * Version : V1.0
 */

import java.util.List;

public class AboutIndexConfigBean {

    private PassengerCabin cabin;

    private CargoHold cargoHold;

    private List<IndexConfig> indexConfigList;

    public PassengerCabin getCabin() {
        return cabin;
    }

    public void setCabin(PassengerCabin cabin) {
        this.cabin = cabin;
    }

    public CargoHold getCargoHold() {
        return cargoHold;
    }

    public void setCargoHold(CargoHold cargoHold) {
        this.cargoHold = cargoHold;
    }

    public List<IndexConfig> getIndexConfigList() {
        return indexConfigList;
    }

    public void setIndexConfigList(List<IndexConfig> indexConfigList) {
        this.indexConfigList = indexConfigList;
    }

}
