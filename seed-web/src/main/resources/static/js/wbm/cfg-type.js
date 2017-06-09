var cfg_index = new Vue({
    el: "#dt-grid",
    data: function () {
        return {
            tableData: this.loadData(),
            showTable: true,
            showForm: false,
            ftcForm: {
                id: null,
                flightType: '',
                seatNum: '',
                harm: '',
                c: '',
                k: '',
                lemac: '',
                datum: '',
                mac: ''
            },
            passengerCabinForm: {
                passengerCabins: [{key: Date.now(), icTableData: [{key: Date.now()}]}]
            },
            cargoHoldForm: {
                cargoHolds: [{key: Date.now(), icTableData: [{key: Date.now()}]}]
            },
            fuelIndexConfigForm: {
                //做数据值初始化aircraftCabinId 舱位关联ID 在燃油参数配置中没有舱位关联设置默认值为-1
                //types:3 表示燃油参数指数设置
                fuels: [{key: Date.now(), icTableData: [{aircraftCabinId: -1, types: 3, key: Date.now()}]}]
            },
            passengerForm: {
                passengers: [
                    {passengerTypeCode: "AUDLT"},// 成人
                    {passengerTypeCode: "CHILD"},// 小孩
                    {passengerTypeCode: "INFANT"}// 婴儿
                ],
                configuration: {"AUDLT": "成人", "CHILD": "小孩", "INFANT": "婴儿"}
            },
            crewForm: {
                crews: [
                    {positionCode: "COCKPIT"},// 驾驶舱
                    {positionCode: "FWD"},// 前舱
                    {positionCode: "MID"},// 中舱
                    {positionCode: "AFT"}// 后舱
                ],
                configuration: {"COCKPIT": "驾驶舱", "FWD": "前舱", "MID": "中舱", "AFT": "后舱"}
            },
            //航班类型参数配置验证规则
            ftcRules: {
                flightType: [
                    {required: true, message: '请输入机型', trigger: 'blur'},
                    {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
                ],
                seatNum: [
                    {required: true, message: '请输入最大座位数'},
                    // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
                    {type: 'number', message: '最大座位数必须为数字值', trigger: 'blur'}
                ],
                harm: [
                    {required: true, message: '请输入基准力臂'},
                    // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
                    {type: 'number', message: '基准力臂必须为数字值', trigger: 'blur'}
                ],
                c: [
                    {required: true, message: '请输入c'},
                    // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
                    {type: 'number', message: 'c必须为数字值', trigger: 'blur'}
                ],
                k: [
                    {required: true, message: '请输入k'},
                    // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
                    {type: 'number', message: 'k必须为数字值', trigger: 'blur'}
                ],
                lemac: [
                    {required: true, message: '请输入lemac'},
                    // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
                    {type: 'number', message: '最大座位数必须为数字值', trigger: 'blur'}
                ],
                datum: [
                    {required: true, message: '请输入datum'},
                    // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
                    {type: 'number', message: 'datum必须为数字值', trigger: 'blur'}
                ],
                mac: [
                    {required: true, message: '请输入mac'},
                    // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
                    {type: 'number', message: 'mac必须为数字值', trigger: 'blur'}
                ]

            }
        }
    },
    methods: {
        loadData: function () {
            var data = {};//组装的data数据
            $.ajax({
                url: "/cfg/flightTypeConfig/list",
                data: {},
                type: 'POST',
                async: false,//需要添加这个参数使用同步功能
                success: function (result) {
                    data = result;
                }
            });
            return data;
        },
        rowClick: function (row, event, column) {
            for (var key in row) {
                //alert(row.id);
            }
        },
        getSelectRows: function (selection, row) {
            var length = selection.length;
            if (length && length == 1) {
                this.ftcForm = row;
                return;
            } else {
                czy.msg.warn("只能选取一条数据!")
                return;
            }
        },
        typeConfEdit: function () {
            if (this.ftcForm.id != null) {
                this.pcAndIcEcho();
                this.showTable = false;
                this.showForm = true;
                return;
            }
            czy.msg.warn("请选择一条数航班类型配置参数!")
        },
        typeConfAdd: function () {
            this.showTable = false;
            this.showForm = true;
        },
        //航班类型参数配置提交function
        submitFtcForm: function (formName) {
            this.$refs[formName].validate(function (result) {
                if (result) {
                    var params = JSON.stringify(cfg_index.ftcForm);
                    $.ajax({
                        url: "/cfg/flightTypeConfig/add",
                        data: params,
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        async: false,//需要添加这个参数使用同步功能
                        success: function (result) {
                            cfg_index.ftcForm.id = result.data.id
                        }
                    });
                }
            });
        },
        //客舱添加输入项
        pcAddClick: function () {
            this.passengerCabinForm.passengerCabins.push({key: Date.now(), icTableData: [{key: Date.now()}]});
        },
        //客舱删除输入项
        pcDelClick: function (passengerCabin) {
            var indexOf = this.passengerCabinForm.passengerCabins.indexOf(passengerCabin);
            if (indexOf !== -1 && indexOf !== 0) {
                this.passengerCabinForm.passengerCabins.splice(indexOf, 1)
            } else {
                czy.msg.warn("不能选择第一条数据!")
            }
        },
        //货舱添加输入项
        chAddClick: function () {
            this.cargoHoldForm.cargoHolds.push({key: Date.now(), icTableData: [{key: Date.now()}]});
        },
        //货舱删除输入项
        chDelClick: function (cargoHold) {
            var indexOf = this.cargoHoldForm.cargoHolds.indexOf(cargoHold);
            if (indexOf !== -1 && indexOf !== 0) {
                this.cargoHoldForm.cargoHolds.splice(indexOf, 1)
            } else {
                czy.msg.warn("不能选择第一条数据!")
            }
        },
        //指数配置增加输入项
        icpcAddClick: function (index) {
            this.passengerCabinForm.passengerCabins[index].icTableData.push({key: Date.now()});
        },
        icpcDelClick: function (index, row) {
            if (index == 0) {
                czy.msg.warn("不能删除第一条数据!");
                return;
            }
            row.splice(index, 1);
        },
        //燃油指数配置增加输入项
        fuelAddClick: function (index) {
            this.fuelIndexConfigForm.fuels[index].icTableData.push({aircraftCabinId: -1, types: 3, key: Date.now()});
        },
        fuelIcDelClick: function (index, row) {
            if (index == 0) {
                czy.msg.warn("不能删除第一条数据!");
                return;
            }
            row.splice(index, 1);
        },
        //指数配置增加输入项
        icchAddClick: function (index) {
            this.cargoHoldForm.cargoHolds[index].icTableData.push({key: Date.now()});
        },
        icchDelClick: function (index, row) {
            if (index == 0) {
                czy.msg.warn("不能删除第一条数据!");
                return;
            }
            row.splice(index, 1);
        },

        submitPcForm: function (passengerCabinForm) {
            var flightTypeConfigId = cfg_index.ftcForm.id;
            if (!flightTypeConfigId || "" == flightTypeConfigId) {
                //在提交客舱之前必须先提交航班类型参数
                this.submitFtcForm("ftcForm");
            }
            // this.$refs["ftcSubmit"].click();
            //提交客舱信息参数
            this.$refs[passengerCabinForm].validate(function (result) {
                if (result) {
                    var cabins = cfg_index.passengerCabinForm.passengerCabins;
                    var data = [];
                    for (var index in cabins) {
                        var singleData = {};//此对象包含客舱信息和指数配置信息列表对象
                        var indexConfigList = {};//指数配置列表对象
                        var cabin = {};//客舱信息配置对象
                        var indexOfObj = cabins[index];
                        for (var key in indexOfObj) {
                            if (key == "icTableData") {
                                indexConfigList = indexOfObj[key];
                                for (var indes in indexConfigList) {
                                    indexConfigList[indes].flightTypeConfigId = cfg_index.ftcForm.id;
                                }
                            } else {
                                cabin[key] = indexOfObj[key];
                            }
                        }
                        cabin.flightTypeConfigId = cfg_index.ftcForm.id;
                        singleData.indexConfigList = indexConfigList;
                        singleData.cabin = cabin;
                        data.push(singleData);
                    }
                    var params = JSON.stringify(data);
                    $.ajax({
                        url: "/cfg/passengerCabin/addList",
                        data: params,
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        success: function (result) {
                            if (result == 200) {
                                czy.msg.success("保存成功!")
                            }
                        }
                    });
                } else {
                    czy.msg.error("校验不通过!")
                }
            });
        },
        submitChForm: function (cargoHold) {
            var flightTypeConfigId = cfg_index.ftcForm.id;
            if (!flightTypeConfigId || "" == flightTypeConfigId) {
                //在提交客舱之前必须先提交航班类型参数
                this.submitFtcForm("ftcForm");
            }
            // this.$refs["ftcSubmit"].click();
            //提交客舱信息参数
            this.$refs[cargoHold].validate(function (result) {
                if (result) {
                    var cargoHolds = cfg_index.cargoHoldForm.cargoHolds;
                    var data = [];
                    for (var index in cargoHolds) {
                        var singleData = {};//此对象包含客舱信息和指数配置信息列表对象
                        var indexConfigList = {};//指数配置列表对象
                        var cargoHold = {};//客舱信息配置对象
                        var indexOfObj = cargoHolds[index];
                        for (var key in indexOfObj) {
                            if (key == "icTableData") {
                                indexConfigList = indexOfObj[key];
                                for (var indes in indexConfigList) {
                                    indexConfigList[indes].flightTypeConfigId = cfg_index.ftcForm.id;
                                }
                            } else {
                                cargoHold[key] = indexOfObj[key];
                            }
                        }
                        cargoHold.flightTypeConfigId = cfg_index.ftcForm.id;
                        singleData.indexConfigList = indexConfigList;
                        singleData.cargoHold = cargoHold;
                        data.push(singleData);
                    }
                    var params = JSON.stringify(data);
                    $.ajax({
                        url: "/cfg/cargoHold/addList",
                        data: params,
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        success: function (result) {
                            if (result == 200) {
                                czy.msg.success("保存成功!")
                            }
                        }
                    });
                } else {
                    czy.msg.error("校验不通过!")
                }
            });
        },
        submitFuelForm: function (fuelIndexConfigForm) {
            var flightTypeConfigId = cfg_index.ftcForm.id;
            if (!flightTypeConfigId || "" == flightTypeConfigId) {
                //在提交客舱之前必须先提交航班类型参数
                this.submitFtcForm("ftcForm");
            }
            //提交客舱信息参数
            this.$refs[fuelIndexConfigForm].validate(function (result) {
                if (result) {
                    var fuels = cfg_index.fuelIndexConfigForm.fuels;
                    var fuelsIndexConfig;
                    //为每项数据添加关联的航班类型ID
                    for (var index in fuels) {
                        var icTableData = fuels[index].icTableData;
                        for (var key in icTableData) {
                            icTableData[key].flightTypeConfigId = cfg_index.ftcForm.id;
                        }
                        fuelsIndexConfig = icTableData;
                    }
                    var params = JSON.stringify(fuelsIndexConfig);
                    $.ajax({
                        url: "/cfg/indexConfig/addList",
                        data: params,
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        success: function (result) {
                            if (result == 200) {
                                czy.msg.success("保存成功!")
                            }
                        }
                    });
                } else {
                    czy.msg.error("校验不通过!")
                }
            });
        },
        //乘客信息配置提交
        submitPassengerForm: function (passenger) {
            var flightTypeConfigId = cfg_index.ftcForm.id;
            if (!flightTypeConfigId || "" == flightTypeConfigId) {
                //在提交客舱之前必须先提交航班类型参数
                this.submitFtcForm("ftcForm");
            }

            if (!cfg_index.ftcForm.id || "" == cfg_index.ftcForm.id) {
                //在提交客舱之前必须先提交航班类型参数
                czy.msg.error("flightTypeConfigId 为空不能提交");
                return;
            }
            //提交客舱信息参数
            this.$refs[passenger].validate(function (result) {
                if (result) {
                    var passengers = cfg_index.passengerForm.passengers;
                    for (var key in passengers) {
                        var passenger = passengers[key];
                        passenger.flightTypeConfigId = cfg_index.ftcForm.id;
                    }
                    var params = JSON.stringify(passengers);
                    $.ajax({
                        url: "/cfg/passenger/addList",
                        data: params,
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        success: function (result) {
                            if (result == 200) {
                                czy.msg.success("保存成功!")
                            }
                        }
                    });
                } else {
                    czy.msg.error("校验不通过!")
                }
            });
        },
        //乘务信息配置提交
        submitCrewForm: function (crew) {
            var flightTypeConfigId = cfg_index.ftcForm.id;
            if (!flightTypeConfigId || "" == flightTypeConfigId) {
                //在提交客舱之前必须先提交航班类型参数
                this.submitFtcForm("ftcForm");
            }

            if (!cfg_index.ftcForm.id || "" == cfg_index.ftcForm.id) {
                //在提交客舱之前必须先提交航班类型参数
                czy.msg.error("flightTypeConfigId 为空不能提交");
                return;
            }
            //提交客舱信息参数
            this.$refs[crew].validate(function (result) {
                if (result) {
                    var crews = cfg_index.crewForm.crews;
                    for (var key in crews) {
                        var crew = crews[key];
                        crew.flightTypeConfigId = cfg_index.ftcForm.id;
                    }
                    var params = JSON.stringify(crews);
                    $.ajax({
                        url: "/cfg/crew/addList",
                        data: params,
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        success: function (result) {
                            if (result == 200) {
                                czy.msg.success("保存成功!")
                            }
                        }
                    });
                } else {
                    czy.msg.error("校验不通过!")
                }
            });
        },
        //回显数据---------------------------------------------------------------//
        //客舱数据和指数参数配置数据回显
        pcAndIcEcho: function () {
            $.ajax({
                url: "/cfg/passengerCabin/queryList",
                data: {flightTypeConfigId: cfg_index.ftcForm.id},
                type: 'POST',
                async: false,//需要添加这个参数使用同步功能
                success: function (result) {
                    var cabins = [];
                    for (var key in result.data) {
                        var obj = result.data[key];
                        var cabin = obj.cabin;
                        var indexConfigList = obj.indexConfigList;
                        var data = $.extend({}, cabin);
                        data.icTableData = indexConfigList;
                        cabins.push(data);
                    }
                    cfg_index.passengerCabinForm.passengerCabins = cabins;
                }
            });

        }


    }
})
