package com.dapakino.api.repository;

import com.dapakino.api.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    List<Order> findByStatusInOrderByOrderDateAsc(List<String> statuses);

    // NUOVO: Conta ordini per orario in un range di date (per filtrare solo quelli di oggi)
    @Query("SELECT COUNT(o) FROM Order o WHERE o.deliveryTime = :time AND o.orderDate BETWEEN :start AND :end")
    int countOrdersByTime(@Param("time") String time, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}