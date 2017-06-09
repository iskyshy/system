package com.czy.seed.mvc.wbm.config.controller;

import com.czy.seed.mvc.util.Res;
import com.czy.seed.mvc.wbm.config.entity.EchoConfBean;
import com.czy.seed.mvc.wbm.config.entity.type.AboutIndexConfigBean;
import com.czy.seed.mvc.wbm.config.entity.type.Crew;
import com.czy.seed.mvc.wbm.config.entity.type.FlightTypeConfig;
import com.czy.seed.mvc.wbm.config.entity.type.IndexConfig;
import com.czy.seed.mvc.wbm.config.service.*;
import com.czy.seed.mybatis.base.QueryParams;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by Administrator on 2017/5/19.
 */
@RestController
@RequestMapping("/cfg/flightTypeConfig")
public class FlightTypeConfigController {

    @Resource
    private FlightTypeConfigService flightTypeConfigServiceImpl;
    @Resource
    private PassengerCabinService passengerCabinServiceImpl;
    @Resource
    private CargoHoldService cargoHoldServiceImpl;
    @Resource
    private IndexConfigService indexConfigServiceImpl;
    @Resource
    private CrewService crewServiceImpl;
    @Resource
    private PassengerService passengerServiceImpl;


    @RequestMapping("/view")
    public FlightTypeConfig view(FlightTypeConfig flightTypeConfig) {
        return flightTypeConfigServiceImpl.selectByPrimaryKey(flightTypeConfig.getId());
    }

    @RequestMapping("/add")
    public Res add(@RequestBody FlightTypeConfig flightTypeConfig) {
        flightTypeConfigServiceImpl.insert(flightTypeConfig);
        return Res.ok(flightTypeConfig);

    }

    @RequestMapping("/update")
    public Integer update(FlightTypeConfig flightTypeConfig) {
        int result = flightTypeConfigServiceImpl.updateByPrimaryKey(flightTypeConfig);
        if (result > 0) {
            return 200;
        } else {
            return 500;
        }
    }

    @RequestMapping("/list")
    public List<FlightTypeConfig> list(FlightTypeConfig flightTypeConfig) {
        QueryParams queryParams = new QueryParams(FlightTypeConfig.class);
        String flightType = flightTypeConfig.getFlightType();//航班类型
        QueryParams.Criteria criteria = queryParams.createCriteria();
        if (flightType != null && !"".equals(flightType.trim())) {
            criteria.andLike("flightType", "%" + flightType + "%");
        }
        List<FlightTypeConfig> list = flightTypeConfigServiceImpl.selectListByParams(queryParams);
        return list;
    }

    /**
     * 根据航班类型主键ID 查询(客舱,货仓,燃油的指数配置,乘务信息配置,乘客信息配置)
     * 组装成一个统一的对象用于回显航班类型配置
     *
     * @param flightTypeConfigId 航班类型主键ID
     * @return
     */
    @RequestMapping("/queryFlightTypeList")
    public Res queryFlightTypeList(@RequestParam Long flightTypeConfigId) {
        List<AboutIndexConfigBean> icAndPcList = passengerCabinServiceImpl.queryList(flightTypeConfigId);
        List<AboutIndexConfigBean> icAndChList = cargoHoldServiceImpl.queryList(flightTypeConfigId);
        QueryParams fuelQueryParams = new QueryParams(IndexConfig.class);
        QueryParams.Criteria criteria = fuelQueryParams.createCriteria();
        criteria.andEqualTo("flightTypeConfigId", flightTypeConfigId)
                //燃油参数没有对应的舱位信息使用默认值-1,数据库中没有自动做默认值
                .andEqualTo("aircraftCabinId", -1);
        List<IndexConfig> fuelList = indexConfigServiceImpl.selectListByParams(fuelQueryParams);

        QueryParams crewQueryParams = new QueryParams(Crew.class);
        QueryParams.Criteria crewCriteria = fuelQueryParams.createCriteria();
        criteria.andEqualTo("flightTypeConfigId", flightTypeConfigId);


        EchoConfBean confBean = new EchoConfBean();
        confBean.setPcList(icAndPcList);
        confBean.setChList(icAndChList);
        confBean.setFuelList(fuelList);
        return Res.ok(confBean);
    }


    @RequestMapping("/del")
    public int del(FlightTypeConfig flightTypeConfig) {
        int result = flightTypeConfigServiceImpl.deleteByPrimaryKey(flightTypeConfig.getId());
        if (result > 0) {
            return 200;
        } else {
            return 500;
        }
    }


    @RequestMapping("/check")
    public Integer check(FlightTypeConfig flightTypeConfig) {
        QueryParams queryParams = new QueryParams(FlightTypeConfig.class);
        QueryParams.Criteria criteria = queryParams.createCriteria();
        criteria.andEqualTo("flightType", flightTypeConfig.getFlightType());
        FlightTypeConfig result = flightTypeConfigServiceImpl.selectOneByParams(queryParams);
        if (result == null) {
            return 200;
        } else {
            return 500;
        }

    }
}
