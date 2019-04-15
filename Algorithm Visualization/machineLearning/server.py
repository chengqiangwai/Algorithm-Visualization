# _*_ coding:utf-8 _*_
__author__ = 'Patrick'
 
 
import socket
import threading
import sys
import os
# import MySQLdb
import base64
import hashlib
import struct
# coding=utf-8
import math
import random
import json
try:
    import cPickle as pickle
except:
    import pickle
 
# ====== config ======
HOST = 'localhost'
PORT = 3368
MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
HANDSHAKE_STRING = "HTTP/1.1 101 Switching Protocols\r\n" \
                   "Upgrade:websocket\r\n" \
                   "Connection: Upgrade\r\n" \
                   "Sec-WebSocket-Accept: {1}\r\n" \
                   "WebSocket-Location: ws://{2}/chat\r\n" \
                   "WebSocket-Protocol:chat\r\n\r\n"

random.seed(0)

def rand(a, b):
    return (b-a)*random.random() + a

# our sigmoid function, tanh is a little nicer than the standard 1/(1+e^-x)


def sigmoid(x):
    return math.tanh(x)



# derivative of our sigmoid function, in terms of the output (i.e. y)


def dsigmoid(y):
    return 1.0 - y**2

# 单个节点，参数为输入的长度


class Unit:
    def __init__(self, length):
        # 产生随机权值
        self.weight = [rand(-0.2, 0.2) for i in range(length)]
        self.change = [0.0] * length
        # threshold相当于阈值boais？
        self.threshold = rand(-0.2, 0.2)
        #self.change_threshold = 0.0

    def calc(self, sample):
        # sample各个输入
        self.sample = sample[:]
        partsum = sum(
            [i * j for i, j in zip(self.sample, self.weight)]) - self.threshold
        self.output = sigmoid(partsum)
        return self.output

    def update(self, diff, rate=0.5, factor=0.1):
        change = [rate * x * diff + factor * c for x,
                  c in zip(self.sample, self.change)]
        # 更新权值
        self.weight = [w + c for w, c in zip(self.weight, change)]
        self.change = [x * diff for x in self.sample]
        #self.threshold = rateN * factor + rateM * self.change_threshold + self.threshold
        #self.change_threshold = factor

    def get_weight(self):
        return self.weight[:]

    def set_weight(self, weight):
        self.weight = weight[:]


class Layer:
    def __init__(self, input_length, output_length):
        self.units = [Unit(input_length) for i in range(output_length)]
        self.output = [0.0] * output_length
        self.ilen = input_length

    def calc(self, sample):
        self.output = [unit.calc(sample) for unit in self.units]
        return self.output[:]

    def update(self, diffs, rate=0.5, factor=0.1):
        for diff, unit in zip(diffs, self.units):
            unit.update(diff, rate, factor)

    def get_error(self, deltas):
        def _error(deltas, j):
            return sum([delta * unit.weight[j] for delta, unit in zip(deltas, self.units)])
        return [_error(deltas, j) for j in range(self.ilen)]

    def get_weights(self):
        weights = {}
        for key, unit in enumerate(self.units):
            weights[key] = unit.get_weight()
        return weights

    def set_weights(self, weights):
        for key, unit in enumerate(self.units):
            unit.set_weight(weights[key])


class BPNNet:
    def __init__(self, ni, nh, no):
        # number of input, hidden, and output nodes
        self.ni = ni + 1  # +1 for bias node
        self.nh = nh
        self.no = no
        self.hlayer = Layer(self.ni, self.nh)

        self.olayer = Layer(self.nh, self.no)

    def calc(self, inputs):
        if len(inputs) != self.ni-1:
            raise ValueError('wrong number of inputs')

        # input activations
        self.ai = inputs[:] + [1.0]

        # hidden activations
        self.ah = self.hlayer.calc(self.ai)
        # output activations
        self.ao = self.olayer.calc(self.ah)
        return self.ao[:]

    def calcTest(self):
        allHiddenOutputs = []
        finalOutputs = []
        for i in range(-20, 20):
            for j in range(-20, 20):
                # print('i：' + str(i) + '  j: ' + str(j))
                tempHiddenOutputs = self.hlayer.calc([i, j, 1.0])
                allHiddenOutputs.append(tempHiddenOutputs)
                finalOutputs.append(self.olayer.calc(tempHiddenOutputs)[0])
        return {
            "allHiddenOutputs": allHiddenOutputs,
            "finalOutputs": finalOutputs
        }

    def update(self, targets, rate, factor):
        if len(targets) != self.no:
            raise ValueError('wrong number of target values')

        # calculate error terms for output
        output_deltas = [dsigmoid(ao) * (target - ao)
                         for target, ao in zip(targets, self.ao)]

        # calculate error terms for hidden
        hidden_deltas = [dsigmoid(
            ah) * error for ah, error in zip(self.ah, self.olayer.get_error(output_deltas))]

        # update output weights
        self.olayer.update(output_deltas, rate, factor)

        # update input weights
        self.hlayer.update(hidden_deltas, rate, factor)
        # calculate error
        return sum([0.5 * (t-o)**2 for t, o in zip(targets, self.ao)])

    def test(self, patterns):
        for p in patterns:
            print(p[0], '->', self.calc(p[0]), p[1])

    def train(self, patterns, connection, iterations=1000, N=0.5, M=0.1):
        # N: learning rate
        # M: momentum factor
        times = 0
        for i in range(iterations):
            error = 0.0
            for p in patterns:
                inputs = p[0]
                targets = p[1]
                self.calc(inputs)
                error = error + self.update(targets, N, M)
                # if times % 10 == 0:
                #     connection.send_data({
                #         "times": times,
                #         "calcResult": self.calcTest(),
                #         "weights": self.getWeights(),
                #         "error": error
                #     })
                times += 1
            if i % 100 == 0:
                print('error %-.10f' % error)
        print("测试结束")

    def getWeights(self):
        return {
            "hiddenLayer": self.hlayer.get_weights(),
            "outputLayer": self.olayer.get_weights()
        }

    def save_weights(self, fn):
        weights = {
            "olayer": self.olayer.get_weights(),
            "hlayer": self.hlayer.get_weights()
        }
        with open(fn, "wb") as f:
            pickle.dump(weights, f)

    def load_weights(self, fn):
        with open(fn, "rb") as f:
            weights = pickle.load(f)
            self.olayer.set_weights(weights["olayer"])
            self.hlayer.set_weights(weights["hlayer"])


def demo(connection):

    # Teach network XOR function
    # pat = [
    #     [[0, 0], [0]],
    #     [[0, 1], [1]],
    #     [[1, 0], [1]],
    #     [[1, 1], [0]]
    # ]
    # create a network with two input, two hidden, and one output nodes
    n = BPNNet(2, 3, 1)
    pat = produceTestData()
    # train it with some patterns
    n.train(pat, connection)
    # test it
    n.save_weights("demo.weights")

    n.test(pat)


def produceTestData():
    pat = []
    patForJs = []
    i = -20
    while i <= 20:
        # print(str(i < -1 | i > 1))
        if i < -1 or i > 1:
            j = 20 / i + i * random.random()
            j2 = -20/i - i * random.random()
            pat.append([
                [i, j], [1]
            ])
            pat.append([
                [i, j2], [-1]
            ])
            patForJs.extend([
                [i, j, 1],
                [i, j2, -1]
            ])
        i = i + random.random()
    fl = open('./dataSetForBPNN.js', 'w')
    fl.write('var dataSetForBPNN = ')
    fl.write(json.dumps(patForJs, ensure_ascii=False, indent=2))
    fl.close()
    return pat
 
class Th(threading.Thread):
    def __init__(self, connection):
        threading.Thread.__init__(self)
        self.con = connection
 
    def run(self):
        # for i in range(10):
        #     self.send_data(str({
        #         "name": "wujianqiu",
        #         "girlfriend": "pengjingchun",
        #         "times" : i
        #     }))
        demo(self)
        print("running...")
        # self.con.close()
 
    def recv_data(self, num):
        try:
            all_data = self.con.recv(num)
            if not len(all_data):
                return False
        except:
            return False
        else:
            code_len = ord(all_data[1]) & 127
            if code_len == 126:
                masks = all_data[4:8]
                data = all_data[8:]
            elif code_len == 127:
                masks = all_data[10:14]
                data = all_data[14:]
            else:
                masks = all_data[2:6]
                data = all_data[6:]
            raw_str = ""
            i = 0
            for d in data:
                raw_str += chr(ord(d) ^ ord(masks[i % 4]))
                i += 1
            return raw_str
 
    # send data
    def send_data(self, data):
        if data:
            data = json.dumps(data, ensure_ascii=False, indent=2)
        else:
            return False
        token = "\x81"
        length = len(data)
        if length < 126:
            token += struct.pack("B", length)
        elif length <= 0xFFFF:
            token += struct.pack("!BH", 126, length)
        else:
            token += struct.pack("!BQ", 127, length)
        #struct为Python中处理二进制数的模块，二进制流为C，或网络流的形式。
        data = '%s%s' % (token, data)
        self.con.send(data)
        return True
 
 
# handshake
def handshake(con):
    headers = {}
    shake = con.recv(1024)
 
    if not len(shake):
        return False
 
    header, data = shake.decode().split('\r\n\r\n', 1)
    for line in header.split('\r\n')[1:]:
        key, val = line.split(': ', 1)
        headers[key] = val
 
    if 'Sec-WebSocket-Key' not in headers:
        print ('This socket is not websocket, client close.')
        con.close()
        return False
 
    sec_key = headers['Sec-WebSocket-Key']
    res_key = base64.b64encode(hashlib.sha1(sec_key + MAGIC_STRING).digest())
 
    str_handshake = HANDSHAKE_STRING.replace('{1}', res_key).replace('{2}', HOST + ':' + str(PORT))
    print(str_handshake)
    con.send(str_handshake)
    return True
 
def new_service():
    """start a service socket and listen
    when coms a connection, start a new thread to handle it"""
 
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.bind(('localhost', 3368))
        sock.listen(1000)
        #链接队列大小
        print( "bind 3368,ready to use")
    except:
        print("Server is already running,quit")
        sys.exit()

 
    while True:
        connection, address = sock.accept()
        #返回元组（socket,add），accept调用时会进入waite状态
        print ("Got connection from ", address)
        if handshake(connection):
            print( "handshake success")
            try:
                t = Th(connection)
                t.start()
                print ('new thread for client ...')
            except:
                print ('start new thread error')
                connection.close()
 
 
if __name__ == '__main__':
    new_service()