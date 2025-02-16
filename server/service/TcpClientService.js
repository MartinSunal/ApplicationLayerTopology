'use strict';
var fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const prepareForwardingAutomation = require('./individualServices/PrepareForwardingAutomation');
const ForwardingAutomationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructAutomationServices');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const ElasticsearchPreparation = require('./individualServices/ElasticsearchPreparation');
const { isTcpClientElasticsearch, elasticsearchService } = require('onf-core-model-ap/applicationPattern/services/ElasticsearchService');
const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const LayerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');

/**
 * Returns remote IPv4 address
 *
 * uuid String 
 * returns inline_response_200_28
 **/
exports.getTcpClientRemoteAddress = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "tcp-client-interface-1-0:remote-address": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      reject();
    }
  });
}

exports.getTcpClientRemoteProtocol = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "tcp-client-interface-1-0:remote-protocol": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      reject();
    }
  });
}



/**
 * Returns target TCP port at server
 *
 * uuid String 
 * returns inline_response_200_29
 **/
exports.getTcpClientRemotePort = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "tcp-client-interface-1-0:remote-port": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      reject();
    }
  });
}


/**
 * Configures remote IPv4 address
 *
 * body Ipaddress_ipv4address_body 
 * uuid String 
 * no response value expected for this operation
 **/
exports.putTcpClientRemoteAddress = function (body, uuid) {
  return new Promise(async function (resolve, reject) {
    try {
      let oldValue = await tcpClientInterface.getRemoteAddressAsync(uuid);
      let newValue = body["tcp-client-interface-1-0:remote-address"];
      if (oldValue !== newValue) {
        let isUpdated = await tcpClientInterface.setRemoteAddressAsync(uuid, newValue);
        if (isUpdated) {
          let forwardingAutomationInputList = await prepareForwardingAutomation.OAMLayerRequest(
            uuid
          );
          ForwardingAutomationService.automateForwardingConstructWithoutInputAsync(
            forwardingAutomationInputList
          );
          if (isTcpClientElasticsearch(uuid)) {
            // recreate all the clients with new connection data
            let uuids = await logicalTerminationPoint.getUuidListForTheProtocolAsync(LayerProtocol.layerProtocolNameEnum.ES_CLIENT);
            for (let uuid of uuids) {
              await elasticsearchService.getClient(true, uuid);
            }
            await ElasticsearchPreparation.prepareElasticsearch();
          }
        }
      }
      resolve();
    } catch (error) {
      reject();
    }
  });
}

/**
 * Configures target TCP port at server
 *
 * body Tcpclientinterfaceconfiguration_remoteport_body 
 * uuid String 
 * no response value expected for this operation
 **/
exports.putTcpClientRemotePort = function (body, uuid) {
  return new Promise(async function (resolve, reject) {
    try {
      let oldValue = await tcpClientInterface.getRemotePortAsync(uuid);
      let newValue = body["tcp-client-interface-1-0:remote-port"];
      if (oldValue !== newValue) {
        let isUpdated = await tcpClientInterface.setRemotePortAsync(uuid, newValue);
        if (isUpdated) {
          let forwardingAutomationInputList = await prepareForwardingAutomation.OAMLayerRequest(
            uuid
          );
          ForwardingAutomationService.automateForwardingConstructWithoutInputAsync(
            forwardingAutomationInputList
          );
          if (isTcpClientElasticsearch(uuid)) {
            // recreate all the clients with new connection data
            let uuids = await logicalTerminationPoint.getUuidListForTheProtocolAsync(LayerProtocol.layerProtocolNameEnum.ES_CLIENT);
            for (let uuid of uuids) {
              await elasticsearchService.getClient(true, uuid);
            }
            await ElasticsearchPreparation.prepareElasticsearch();
          }
        }
      }
      resolve();
    } catch (error) { }
    reject();
  });
}

exports.putTcpClientRemoteProtocol = function (body, uuid) {
  return new Promise(async function (resolve, reject) {
    try {
      let oldValue = await tcpClientInterface.getRemoteProtocolAsync(uuid);
      let newValue = body["tcp-client-interface-1-0:remote-protocol"];
      if (oldValue !== newValue) {
        let isUpdated = await tcpClientInterface.setRemoteProtocolAsync(uuid, newValue);
        if (isUpdated) {
          let forwardingAutomationInputList = await prepareForwardingAutomation.OAMLayerRequest(
            uuid
          );
          ForwardingAutomationService.automateForwardingConstructWithoutInputAsync(
            forwardingAutomationInputList
          );
          if (isTcpClientElasticsearch(uuid)) {
            // recreate all the clients with new connection data
            let uuids = await logicalTerminationPoint.getUuidListForTheProtocolAsync(LayerProtocol.layerProtocolNameEnum.ES_CLIENT);
            for (let uuid of uuids) {
              await elasticsearchService.getClient(true, uuid);
            }
            await ElasticsearchPreparation.prepareElasticsearch();
          }
        }
      }
      resolve();
    } catch (error) {
      reject();
    }
  });
}
